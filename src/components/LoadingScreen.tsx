interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number; // 0-100
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Loading...",
  showProgress = false,
  progress = 0
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Unique animated dots loader */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-(--color-primary) rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-(--color-primary) rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-(--color-primary) rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        <p className="text-muted-foreground font-medium">{message}</p>

        {/* Optional progress bar */}
        {showProgress && (
          <div className="w-64 mx-auto space-y-2">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-(--color-primary) rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              ></div>
            </div>
            <p className="text-xs text-(--color-muted-foreground) font-medium">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;