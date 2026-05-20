import {Alert} from 'react-native';

interface ErrorContext {
  componentName?: string;
  actionName?: string;
  extraData?: Record<string, unknown>;
}

/**
 * Central Error Handler for the application.
 * Processes all errors, handles logging, and displays user-friendly messages.
 */
export const handleError = (error: unknown, context?: ErrorContext): void => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const detailedMessage = `Error in ${context?.componentName || 'Unknown'} -> ${
    context?.actionName || 'Unknown'
  }: ${errorMessage}`;

  // In development, show an alert or handle appropriately.
  // In production, this would send the error to Sentry or another tracking service.
  if (__DEV__) {
    Alert.alert('System Error', detailedMessage, [{text: 'OK'}]);
  } else {
    // Non-console production logging (e.g. Sentry.captureException(error))
  }
};
