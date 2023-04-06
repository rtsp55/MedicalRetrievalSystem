import { Page, SearchBar } from "@components";

const Home = () => (
  <Page className="justify-center items-center h-[calc(100vh-4rem)]">
    <h2 style={{ marginBottom: '10px' }}>MEDICAL INFORMATION RETRIEVAL</h2>
    <p style={{fontSize: '15px'}}>About your medical questions</p>

    <SearchBar className="mt-4" />
    <footer style={{ marginTop: '20px', textAlign: 'center' }}>Developed by 19pw39,19pw32
    </footer>
  </Page>
);

export default Home;
