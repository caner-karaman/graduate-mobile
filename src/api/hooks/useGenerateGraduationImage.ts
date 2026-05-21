import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { generateGraduationImage } from '../generated/graduation';
import { handleError } from '../../utils/errorHandler';

export interface GenerateGraduationImageParams {
  imageUrl: string;
}

/**
 * Custom React Query hook for generating a graduation image.
 * Expects a public CDN URL (obtained via useUploadFile) and calls
 * the generate endpoint, returning the generated image URL.
 */
export const useGenerateGraduationImage = (): UseMutationResult<
  string,
  Error,
  GenerateGraduationImageParams
> => {
  return useMutation<string, Error, GenerateGraduationImageParams>({
    mutationFn: async (params: GenerateGraduationImageParams) => {
      const result = await generateGraduationImage({ imageUrl: params.imageUrl });
      
      // OpenAPI declares string, but actual server response might be an object: { url: string }
      if (result && typeof result === 'object') {
        const urlObj = result as unknown as { url: string };
        if (urlObj.url) {
          return urlObj.url;
        }
      }

      return result as unknown as string;
    },
    onError: (error) => {
      handleError(error, {
        componentName: 'useGenerateGraduationImage',
        actionName: 'generateGraduationImage',
      });
    },
  });
};
