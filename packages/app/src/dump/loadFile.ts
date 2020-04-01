import { IEmbeddedDumpSchema } from './interfaces';

export default function loadFile(file: File) {
  return new Promise<IEmbeddedDumpSchema>((resolve, reject) => {
    const r = new FileReader();
    r.addEventListener('load', () => {
      const data = JSON.parse(r.result as string);
      resolve(data);
    });
    r.addEventListener('error', () => {
      reject(r.error);
    });
    r.readAsText(file);
  });
}
