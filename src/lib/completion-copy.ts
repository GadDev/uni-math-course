export const completionCopy = {
  en: {
    title: 'Your lesson progress',
    explanation:
      'Finished for now? Mark this lesson as completed. You can revisit it and practise whenever you like.',
    mark: 'Mark as completed',
    undo: 'Mark as not completed',
    completed: 'Completed',
    incomplete: 'Not completed',
    signIn: 'Sign in to save your lesson progress',
    loading: 'Checking your lesson progress…',
    saving: 'Saving…',
    error:
      'Your completion status could not be confirmed. Reload your progress before trying again.',
    retry: 'Reload progress',
    count: (done: number, total: number) =>
      `${done} of ${total} lessons completed`,
  },
  fr: {
    title: 'Votre progression de lecture',
    explanation:
      'Vous avez terminé pour le moment ? Marquez cette leçon comme terminée. Vous pourrez la relire et vous exercer à tout moment.',
    mark: 'Marquer comme terminée',
    undo: 'Marquer comme non terminée',
    completed: 'Terminée',
    incomplete: 'Non terminée',
    signIn: 'Se connecter pour enregistrer votre progression',
    loading: 'Vérification de votre progression…',
    saving: 'Enregistrement…',
    error:
      'Votre progression n’a pas pu être confirmée. Rechargez-la avant de réessayer.',
    retry: 'Recharger la progression',
    count: (done: number, total: number) =>
      `${done} ${done === 1 ? 'leçon terminée' : 'leçons terminées'} sur ${total}`,
  },
} as const;
