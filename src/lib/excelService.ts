// src/lib/excelService.ts
import * as XLSX from 'xlsx';
import type { ChildRegistration } from '../types';
import { EBV_COST_PER_CHILD } from './constants';

export interface AgeRange {
  min: number;
  max: number;
  name: string; // "Preescolares", "Escolares", etc.
}

// Función auxiliar para formatear datos con encabezados "Pro"
const formatChildForExcel = (child: ChildRegistration) => ({
  'ID REGISTRO': child.id || 'N/A',
  'NOMBRE COMPLETO': child.childName.toUpperCase(), // Mayúsculas para uniformidad
  'EDAD': child.age,
  'GÉNERO': child.gender === 'niño' ? 'NIÑO' : 'NIÑA',
  'PADRE / TUTOR': child.parentName.toUpperCase(),
  'INVITADO POR': (child.invitedBy || '').toUpperCase(),
  'MONTO PAGADO ($)': child.paidAmount, // Indicamos moneda
  'COSTO CUBIERTO': child.paidAmount >= EBV_COST_PER_CHILD ? 'SÍ' : 'NO',
  'FECHA REGISTRO': child.createdAt.toLocaleDateString()
});
  
export const downloadSegmentedExcel = (
  registrations: ChildRegistration[], 
  ageRanges: AgeRange[]
) => {
  const wb = XLSX.utils.book_new();
  
  const addSegmentedSheet = (gender: 'niño' | 'niña', sheetNamePrefix: string) => {
    ageRanges.forEach(range => {
      const filteredData = registrations.filter(child => 
        child.gender === gender && 
        child.age >= range.min && 
        child.age <= range.max
      );
  
      if (filteredData.length > 0) {
        const formattedData = filteredData.map(formatChildForExcel);
        
        // Creamos la hoja de cálculo
        const ws = XLSX.utils.json_to_sheet(formattedData);
        
        // --- AUTOCALCULO DE ANCHOS MEJORADO ---
        if (formattedData.length > 0) {
            const sampleRow = formattedData[0];
            const colWidths = Object.keys(sampleRow).map(key => {
                // Obtenemos el largo máximo de los datos en esta columna
                const maxCellLength = Math.max(
                    ...formattedData.map(row => String(row[key as keyof typeof sampleRow] || '').length)
                );
                // El ancho es el máximo entre el encabezado (+2 para aire) y el dato más largo
                return {
                    wch: Math.max(key.length + 2, maxCellLength)
                };
            });
            ws['!cols'] = colWidths;
        }
  
        // Nombre de pestaña Pro (respetando límite de 31 caracteres)
        const tabName = `${sheetNamePrefix} ${range.name}`.substring(0, 31);
        XLSX.utils.book_append_sheet(wb, ws, tabName);
      }
    });
  };
  
  addSegmentedSheet('niño', 'NIÑOS'); // Nombres de pestaña en mayúscula
  addSegmentedSheet('niña', 'NIÑAS');
  
  if (wb.SheetNames.length === 0) {
    const ws = XLSX.utils.json_to_sheet([]);
    XLSX.utils.book_append_sheet(wb, ws, "SIN REGISTROS");
  }
  
  XLSX.writeFile(wb, `EBV_Iluminacion_Registros_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
};