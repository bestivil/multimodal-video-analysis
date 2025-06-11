import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ErrorComponentProps = {
  message?: string;
  refetchTranscript?: () => void;
  refetchBreakdown?: () => void;
};

export default function ErrorComponent({
  message,
  refetchTranscript,
  refetchBreakdown,
}: ErrorComponentProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-[50%] min-h-[200px] w-full bg-muted-foreground/10 rounded-lg cursor-pointer select-none"
      onClick={() => {
        refetchTranscript?.();
        refetchBreakdown?.();
      }}
      tabIndex={0}
      role="button"
      aria-label="Retry loading transcript"
    >
      <div className="flex flex-row items-center gap-2 text-lg font-semibold text-muted-foreground mb-2 rounded px-2 py-1">
        <FontAwesomeIcon icon={faExclamationTriangle} />
        Error
      </div>
      {message && (
        <div className="text-sm  text-muted-foreground mb-4 text-center px-4 rounded py-1">
          {message}
        </div>
      )}
      <div className="text-xs text-muted-foreground rounded p-6">
        Click to retry
      </div>
    </div>
  );
}
