import { Ids } from '../model/ids';

export const uniqueIdsArray = (array: Ids[]) =>
  array.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (item: Ids) =>
          item.fileId === current.fileId &&
          item.assetId === current.assetId &&
          item.fieldId === current.fieldId
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      accumulator.push(current);
    }
    return accumulator;
  }, []);

export const uniqueFilesArray = (array: any[]) =>
  array.reduce((accumulator, current) => {
    if (
      !accumulator.find(
        (item: any) =>
          item.name === current.name &&
          item.size === current.size &&
          item.type === current.type &&
          item.assetId === current.assetId &&
          item.fieldId === current.fieldId
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      accumulator.push(current);
    }
    return accumulator;
  }, []);
