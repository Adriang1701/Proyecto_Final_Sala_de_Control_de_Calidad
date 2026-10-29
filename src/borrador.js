const CLAVE = 'inscribeuaq-borrador'
export const leerBorrador = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) ?? [] } catch { return [] } }
export const guardarBorrador = (tira) => { try { localStorage.setItem(CLAVE, JSON.stringify(tira)) } catch { /* sin almacenamiento: sólo se pierde la recuperación */ } }
