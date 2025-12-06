import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { all } from '@awesome.me/kit-a655910996/icons';

import { CalculatorPage, InfoIcon } from "./CalculatorPage";

import {
  MolarityInfo,
  DilutionInfo,
  OsmoticPressureInfo,
  RaoultInfo,
  BoilingPointElevationInfo,
  FreezingPointDepressionInfo,
} from "../../components/CalcInfo";

library.add(...all);

const SolutionIcon = (
  <FontAwesomeIcon
    icon="fa-duotone fa-flask"
    size="lg"
    style={{
      "--fa-secondary-color": "#fc6601",
      "--fa-primary-color": "#ffffff",
      "--fa-secondary-opacity": "1",
    }}
    className="pr-2 hvr-pulse-grow"
  />
);

/**
 * Solutions overview for info tab
 */
function SolutionsOverview() {
  return (
    <>
      <p className="text-left mb-3">
        <strong>Solution chemistry</strong> describes the behavior of homogeneous
        mixtures where one substance (the solute) is dissolved in another (the solvent).
        Understanding solutions is fundamental to laboratory work, biological systems,
        and industrial processes.
      </p>
      <p className="text-left mb-3">
        Key concepts include:
      </p>
      <ul className="text-left space-y-1 mb-4">
        <li><strong>Concentration</strong>: Molarity, molality, and mole fraction</li>
        <li><strong>Dilution</strong>: Reducing concentration by adding solvent</li>
        <li><strong>Colligative Properties</strong>: Properties that depend on particle count, not identity</li>
      </ul>
      <p className="text-center mt-4">
        {"$$\\text{Molarity} = \\frac{\\text{moles of solute}}{\\text{liters of solution}}$$"}
      </p>
    </>
  );
}

/**
 * Colligative properties overview
 */
function ColligativeOverview() {
  return (
    <>
      <p className="text-left mb-3">
        <strong>Colligative properties</strong> are solution properties that depend
        only on the number of solute particles present, not on their chemical identity.
        These properties arise from the dilution of the solvent by solute particles.
      </p>
      <p className="text-left mb-3">
        The four colligative properties are:
      </p>
      <ul className="text-left space-y-1 mb-4">
        <li><strong>Vapor Pressure Lowering</strong>: Raoult's Law</li>
        <li><strong>Boiling Point Elevation</strong>: {"\\(\\Delta T_b = K_b m i\\)"}</li>
        <li><strong>Freezing Point Depression</strong>: {"\\(\\Delta T_f = K_f m i\\)"}</li>
        <li><strong>Osmotic Pressure</strong>: {"\\(\\Pi = MRT\\)"}</li>
      </ul>
      <p className="text-left mt-4 text-sm text-gray-600">
        The van't Hoff factor {"\\(i\\)"} accounts for dissociation of electrolytes.
      </p>
    </>
  );
}

// Tab configuration
const TABS = [
  { key: 'info', title: 'Info' },
  { key: 'molarity', title: 'Molarity' },
  { key: 'dilution', title: 'Dilution' },
  { key: 'osmoticPressure', title: 'Osmotic Pressure' },
  { key: 'raoult', title: "Raoult's Law" },
  { key: 'boilingPointElevation', title: 'Boiling Point' },
  { key: 'freezingPointDepression', title: 'Freezing Point' },
];

// Calculator configurations
const CALCULATORS = {
  molarity: { Info: MolarityInfo, id: 'molarity' },
  dilution: { Info: DilutionInfo, id: 'dilution' },
  osmoticPressure: { Info: OsmoticPressureInfo, id: 'osmoticPressure' },
  raoult: { Info: RaoultInfo, id: 'raoult' },
  boilingPointElevation: { Info: BoilingPointElevationInfo, id: 'boilingPointElevation' },
  freezingPointDepression: { Info: FreezingPointDepressionInfo, id: 'freezingPointDepression' },
};

// Info tab configuration
const INFO_TAB = {
  Info1: SolutionsOverview,
  Info2: ColligativeOverview,
  title1: 'Solutions',
  title2: 'Colligative Properties',
  icon2: SolutionIcon,
};

/**
 * Solutions Calculator Page
 */
const SolutionsPage = () => {
  return (
    <CalculatorPage
      basePath="/calculators/solutions"
      tabs={TABS}
      infoTab={INFO_TAB}
      calculators={CALCULATORS}
    />
  );
};

export default SolutionsPage;
