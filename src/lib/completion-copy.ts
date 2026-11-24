export const completionCopy = {
  en: {
    title: 'Your reading progress',
    explanation:
      'Mark the reading as complete when you finish it. Your exercise results are saved separately.',
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
      'Marquez la lecture comme terminée lorsque vous l’avez finie. Les résultats des exercices sont enregistrés séparément.',
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
