import PdfViewerComponent from '../components/PdfViewerComponent';
import TestButton from '../components/TestComponent';
import WSTestComponent from '../components/WSTestComponent';

function TestPage() {
  return (
    <div>
        <TestButton />
        <PdfViewerComponent />
        <WSTestComponent />
    </div>
  );
}

export default TestPage;