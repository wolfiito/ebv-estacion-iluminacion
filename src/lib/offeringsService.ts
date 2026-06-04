import { collection, addDoc, serverTimestamp, deleteDoc, doc, FirestoreError } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "offerings";

export const addOffering = async (name: string, amount: number): Promise<string> => {
  try {
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      throw new Error("El monto proporcionado no es un número válido o es menor o igual a 0.");
    }

    const coll = collection(db, COLLECTION_NAME);
    
    const docRef = await addDoc(coll, {
      name: name.trim() || 'Anónimo',
      amount,
      createdAt: serverTimestamp(),
    });
    
    return docRef.id;
    
  } catch (error) {
    console.error("Error al registrar ofrenda:", error);
    if (error instanceof FirestoreError && error.code === 'permission-denied') {
        throw new Error("No tienes permisos para realizar esta acción. Contacta al administrador.");
    }
    throw new Error("No se pudo guardar la ofrenda.");
  }
};

export const deleteOffering = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar ofrenda:", error);
    if (error instanceof Error) {
        throw new Error(error.message);
    }
    throw new Error("No se pudo eliminar la ofrenda.");
  }
};
