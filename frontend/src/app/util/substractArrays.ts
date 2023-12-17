export const substractArrays = (a1, a2) => {
  return a1?.filter(
    (o1) =>
      !a2.some(
        (o2) =>
          o1.fileId === o2.fileId &&
          o1.fieldId === o2.fieldId &&
          o1.assetId === o2.assetId
      )
  );
};
