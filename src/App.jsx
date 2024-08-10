
import Autocomplete from './components/Autocomplete';
import SearchProvider from './algolia/SearchProvider';

const App = () => {
  return (
    <SearchProvider>
      <Autocomplete />
    </SearchProvider>

  );
};

export default App;
