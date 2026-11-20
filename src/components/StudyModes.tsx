export default function StudyModes({ locale }: { locale: 'fr' | 'en' }) {
  const fr = locale === 'fr';
  return (
    <div className="exam-study-modes">
      <h3>
        {fr ? 'Choisir votre méthode de travail' : 'Choose your study approach'}
      </h3>
      <p>
        <strong>
          {fr
            ? 'En conditions d’examen — documents autorisés'
            : 'Exam conditions — reference materials allowed'}
        </strong>
        {' · '}
        {fr
          ? 'Pour cet entraînement, gardez votre cours et la fiche mémo à portée de main et justifiez vos démarches sur papier. Cette méthode ne confirme pas le règlement de l’épreuve officielle.'
          : 'For this practice, keep your course and quick reference nearby and justify your reasoning on paper. This approach does not confirm the official examination rules.'}
      </p>
      <p>
        <strong>{fr ? 'Rappel sans notes' : 'Closed-book recall'}</strong>
        {' · '}
        {fr
          ? 'Résolvez d’abord sans consulter vos documents, puis utilisez la correction pour repérer les méthodes à revoir.'
          : 'Solve the paper without consulting your materials first, then use the solutions to identify methods to review.'}
      </p>
      <p>
        {fr
          ? 'Règles officielles sur la calculatrice : à confirmer auprès de l’enseignant.'
          : 'Official calculator rules: confirm with your teacher.'}
      </p>
      <a href={`/${locale}/cheat-sheet/`}>
        {fr ? 'Ouvrir la fiche mémo' : 'Open quick reference'} →
      </a>
    </div>
  );
}
