import {shallow, mount} from 'enzyme'
import CountriesList from './CountriesList'
import {countries} from '../../data/countries'
import Loader from '../common/Loader'

it('should render loader', () => {
  const container = shallow(<CountriesList loading />)

  expect(container.contains(<Loader />))
})