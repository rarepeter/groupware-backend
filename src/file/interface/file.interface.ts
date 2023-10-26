import { SecondsTimestamp, UUID } from '../../types/global.type';
import { User } from '../../user/interface/user.interface';

const allPossibleFileTypes = ['personal', 'cv', 'request'] as const;
type FileType = (typeof allPossibleFileTypes)[number];
type IFile = {
  fileId: UUID;
  fileName: string;
  extension: string;
  mimeType: string;
  uploadedAtTimestamp: SecondsTimestamp;
  uploadedByUserId: User['userId'];
  type: FileType;
};

type FileFrontEndDto = Pick<
  IFile,
  'fileId' | 'extension' | 'mimeType' | 'fileName'
> & { fileBase64Url: string };

export { IFile, FileFrontEndDto };
