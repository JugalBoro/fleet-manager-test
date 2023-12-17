import { IcsField } from '../../../types/ics-field';

export type IdentificationDto = {
  status: Partial<IcsField>;
  alias: Partial<IcsField>;
  assetName: Partial<IcsField>;
  assetNumber: Partial<IcsField>;
  category: Partial<IcsField>;
  manufacturer: Partial<IcsField>;
  serialNumber: Partial<IcsField>;
  creationDate: Partial<IcsField>;
  year: Partial<IcsField>;
  busSystem: Partial<IcsField>;
};
