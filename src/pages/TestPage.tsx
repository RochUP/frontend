import PdfViewerComponent from '../components/testComponents/PdfViewerComponent';
import StoreTestComponent from '../components/testComponents/StoreTestComponent';
import TestButton from '../components/testComponents/TestComponent';
import WSTestComponent from '../components/testComponents/WSTestComponent';
import SpeechRecTestComponent from '../components/testComponents/SpeechRecTestComponent';
import AzureStorageComponent from '../components/testComponents/AzureStorageComponent';

function TestPage() {
  return (
    <div>
        {/* <TestButton /> */}
        <PdfViewerComponent />
        {/* <WSTestComponent /> */}
        {/* <StoreTestComponent /> */}
        {/* <SpeechRecTestComponent /> */}
        <AzureStorageComponent />
    </div>
  );
}

export default TestPage;