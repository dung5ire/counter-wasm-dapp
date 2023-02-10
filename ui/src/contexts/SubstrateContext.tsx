import { createContext } from 'react'
import { SubstrateContextType } from '../types/SubstrateContext';

const SubstrateContext = createContext<SubstrateContextType | null>(null);

export default SubstrateContext;
