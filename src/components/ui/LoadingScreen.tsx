import LoadingToast from "./LoadingToast";

function LoadingScreen() {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm">
        <LoadingToast size="extra-large" text="Loading" />
      </div>
    );
  }

export default LoadingScreen;