import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { uploadFile } from '../generated/graduation';
import { handleError } from '../../utils/errorHandler';

export interface UploadFileParams {
  uri: string;
  fileName?: string;
  type?: string;
  folder?: string;
}

/**
 * Custom React Query hook for uploading a local file (e.g. a selfie) to the CDN.
 * Returns the public CDN URL as a string on success.
 */
export const useUploadFile = (): UseMutationResult<
  string,
  Error,
  UploadFileParams
> => {
  return useMutation<string, Error, UploadFileParams>({
    mutationFn: async (params: UploadFileParams) => {
      const rnFile = {
        uri: params.uri,
        name: params.fileName || 'selfie.jpg',
        type: params.type || 'image/jpeg',
      } as unknown as Blob;

      const cdnUrl = await uploadFile(
        { file: rnFile },
        { folder: params.folder || 'graduation' },
      );

      // OpenAPI declares string, but actual server response might be an object: { url: string }
      if (cdnUrl && typeof cdnUrl === 'object') {
        const urlObj = cdnUrl as unknown as { url: string };
        if (urlObj.url) {
          return urlObj.url;
        }
      }

      return cdnUrl as unknown as string;
    },
    onError: (error) => {
      handleError(error, {
        componentName: 'useUploadFile',
        actionName: 'uploadFile',
      });
    },
  });
};
