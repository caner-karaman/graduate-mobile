import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { generateGraduationImage } from '../generated/graduation';
import { handleError } from '../../utils/errorHandler';

export interface GenerateGraduationImageParams {
  uri: string;
  fileName?: string;
  type?: string;
}

/**
 * Custom React Query hook for generating a graduation image from a selfie.
 * Wraps the raw generated API client function and handles React Native file uploading.
 */
export const useGenerateGraduationImage = (): UseMutationResult<
  string,
  Error,
  GenerateGraduationImageParams
> => {
  return useMutation<string, Error, GenerateGraduationImageParams>({
    mutationFn: async (params: GenerateGraduationImageParams) => {
      // In React Native, file upload via FormData requires passing an object
      // with uri, name, and type properties. We cast it to Blob to satisfy the generated types.
      const rnFile = {
        uri: params.uri,
        name: params.fileName || 'selfie.jpg',
        type: params.type || 'image/jpeg',
      } as unknown as Blob;

      const response = await generateGraduationImage({ file: rnFile });
      return response;
    },
    onError: (error) => {
      handleError(error, {
        componentName: 'useGenerateGraduationImage',
        actionName: 'generateGraduationImage',
      });
    },
  });
};
