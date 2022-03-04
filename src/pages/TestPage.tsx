import PdfViewerComponent from '../components/testComponents/PdfViewerComponent';
import StoreTestComponent from '../components/testComponents/StoreTestComponent';
import TestButton from '../components/testComponents/TestComponent';
import WSTestComponent from '../components/testComponents/WSTestComponent';

function TestPage() {
  return (
    <div>
        <TestButton />
        {/* <PdfViewerComponent />
        <WSTestComponent /> */}
        <StoreTestComponent />
    </div>
  );
}

export default TestPage;