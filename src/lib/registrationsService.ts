// src/lib/registrationsService.ts
import { collection, addDoc, serverTimestamp, updateDoc, doc, FirestoreError } from "firebase/firestore";
import { db } from "./firebase";
import { type RegistrationFormData } from "./validation";

// Nombre de la colección en Firestore (centralizado para evitar errores de dedo)
const COLLECTION_NAME = "registrations";

/**
 * Crea un nuevo registro de inscripción en Firestore.
 * Inicializa el monto pagado en 0.
 * @param data Datos validados del formulario.
 * @returns El ID del documento creado.
 */
export const createRegistration = async (data: RegistrationFormData): Promise<string> => {
  try {
    const regsCollection = collection(db, COLLECTION_NAME);
    
    // Preparamos los datos completos para guardar (incluyendo campos administrativos)
    // Usamos serverTimestamp() para que la fecha la ponga Firebase, no el cliente.
    const finalData = {
      ...data,
      paidAmount: 0, // Inicializamos monetariamente en 0
      createdAt: serverTimestamp(), // Marca de tiempo del servidor
    };

    // Guardamos el documento en Firestore
    const docRef = await addDoc(regsCollection, finalData);
    
    console.log("Registro creado exitosamente con ID:", docRef.id);
    return docRef.id;
    
  } catch (error) {
    // Senior Practice: Loguear el error internamente y lanzar un error genérico/amigable para la UI
    console.error("Error crítico al guardar el registro en Firestore:", error);
    
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
        throw new Error("No tienes permisos para realizar esta acción. Contacta al administrador.");
    }
    
    throw new Error("No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde.");
  }
};

/**
 * Actualiza el monto pagado por un niño.
 * @param id ID del documento del niño.
 * @param newAmount Nuevo monto total pagado (debe ser >= 0).
 */
export const updateRegistrationPaidAmount = async (id: string, newAmount: number): Promise<void> => {
  try {
    // Senior Practice: Validación robusta de datos antes de enviarlos a la DB
    if (typeof newAmount !== 'number' || isNaN(newAmount) || newAmount < 0) {
      throw new Error("El monto proporcionado no es un número válido o es negativo.");
    }
    
    // Referencia específica al documento usando su ID
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Actualizamos atómicamente solo el campo 'paidAmount'
    await updateDoc(docRef, {
      paidAmount: newAmount
    });
    
    console.log(`Monto pagado actualizado para ${id} a ${newAmount}`);
    
  } catch (error) {
    console.error("Error al actualizar el monto pagado en Firestore:", error);
    
    if (error instanceof Error) {
        throw new Error(error.message); // Re-lanzamos errores de validación propios
    }
    
    throw new Error("No se pudo actualizar el monto pagado. Verifica tu conexión e inténtalo de nuevo.");
  }
};