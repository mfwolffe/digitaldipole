import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { all } from '@awesome.me/kit-a655910996/icons';

import { CalculatorPage } from "./CalculatorPage";

import {
  ThermInfo1,
  ThermInfo2,
  StateHeat,
  EntropyInfo,
  GibbsInfo,
  EntropyChangeInfo,
  WorkPVInfo,
  FirstLawInfo,
  MolarHeatCapacityInfo,
  ClausiusClapeyronInfo,
  IsothermalWorkInfo,
} from "../../components/CalcInfo";

library.add(...all);

const ThermIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-fire-flame-curved"
    size="lg"
    style={{
      "--fa-secondary-color": "#fc6601",
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2 hvr-pulse-grow"
  />
);

// Tab configuration
const TABS = [
  { key: 'info', title: 'Info' },
  { key: 'enthalpy', title: 'Enthalpy Calculator' },
  { key: 'heat', title: 'Heat Transfer' },
  { key: 'gibbs', title: 'Gibbs Free Energy' },
  { key: 'entropyChange', title: 'Entropy Change' },
  { key: 'work', title: 'Work (PV)' },
  { key: 'firstLaw', title: 'First Law' },
  { key: 'molarHeat', title: 'Molar Heat Capacity' },
  { key: 'clausiusClapeyron', title: 'Clausius-Clapeyron' },
  { key: 'isothermalWork', title: 'Isothermal Work' },
];

// Calculator configurations
const CALCULATORS = {
  enthalpy: { Info: StateHeat, id: 'enthalpy' },
  heat: { Info: StateHeat, id: 'heat' },
  gibbs: { Info: GibbsInfo, id: 'gibbs' },
  entropyChange: { Info: EntropyChangeInfo, id: 'entropyChange' },
  work: { Info: WorkPVInfo, id: 'work' },
  firstLaw: { Info: FirstLawInfo, id: 'firstLaw' },
  molarHeat: { Info: MolarHeatCapacityInfo, id: 'molarHeat' },
  clausiusClapeyron: { Info: ClausiusClapeyronInfo, id: 'clausiusClapeyron' },
  isothermalWork: { Info: IsothermalWorkInfo, id: 'isothermalWork' },
};

// Info tab configuration
const INFO_TAB = {
  Info1: ThermInfo1,
  Info2: ThermInfo2,
  title1: 'Thermodynamics',
  title2: 'Laws of Thermodynamics',
  icon2: ThermIcon,
};

/**
 * Thermodynamics Calculator Page
 */
const ThermodynamicsPage = () => {
  return (
    <CalculatorPage
      basePath="/calculators/thermo"
      tabs={TABS}
      infoTab={INFO_TAB}
      calculators={CALCULATORS}
    />
  );
};

export default ThermodynamicsPage;
