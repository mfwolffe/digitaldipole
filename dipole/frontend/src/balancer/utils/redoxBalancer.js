/**
 * Redox Equation Balancer - Half-Reaction Method
 *
 * Balances redox equations by:
 * 1. Identifying oxidation and reduction half-reactions
 * 2. Balancing each half-reaction separately
 * 3. Equalizing electrons transferred
 * 4. Combining half-reactions
 *
 * Works in both acidic and basic solutions.
 */

import { getAllElements } from './chemicalParser.js';

// Common oxidation states for elements
const COMMON_OXIDATION_STATES = {
  H: [1, -1, 0],
  O: [-2, -1, 0],
  F: [-1],
  Cl: [-1, 0, 1, 3, 5, 7],
  Br: [-1, 0, 1, 3, 5],
  I: [-1, 0, 1, 5, 7],
  N: [-3, 0, 1, 2, 3, 4, 5],
  S: [-2, 0, 2, 4, 6],
  C: [-4, -2, 0, 2, 4],
  P: [-3, 0, 3, 5],
  // Metals
  Na: [1],
  K: [1],
  Ca: [2],
  Mg: [2],
  Al: [3],
  Fe: [0, 2, 3],
  Cu: [0, 1, 2],
  Zn: [0, 2],
  Ag: [0, 1],
  Mn: [0, 2, 4, 7],
  Cr: [0, 2, 3, 6],
  Sn: [0, 2, 4],
  Pb: [0, 2, 4],
};

/**
 * Calculate oxidation state of an element in a compound
 * Uses common rules and known states
 */
export function calculateOxidationState(compound, targetElement) {
  const elements = compound.elements || [];
  const charge = compound.charge || 0;

  // Single element
  if (elements.length === 1) {
    const elem = elements[0];
    if (elem.count === 1) {
      return charge; // Monatomic ion or element
    }
    return charge / elem.count; // Diatomic element with charge
  }

  // Calculate using known oxidation states
  let knownSum = 0;
  let unknownCount = 0;
  let unknownElement = null;
  let unknownMultiplier = 0;

  for (const elem of elements) {
    if (elem.symbol === targetElement) {
      unknownCount++;
      unknownMultiplier = elem.count;
      unknownElement = elem.symbol;
    } else if (elem.symbol === 'O') {
      // Oxygen is usually -2 (except in peroxides, superoxides)
      knownSum += -2 * elem.count;
    } else if (elem.symbol === 'H') {
      // Hydrogen is usually +1 (except in metal hydrides)
      knownSum += 1 * elem.count;
    } else if (elem.symbol === 'F') {
      // Fluorine is always -1
      knownSum += -1 * elem.count;
    } else if (['Na', 'K', 'Li', 'Rb', 'Cs'].includes(elem.symbol)) {
      knownSum += 1 * elem.count;
    } else if (['Ca', 'Mg', 'Ba', 'Sr', 'Zn'].includes(elem.symbol)) {
      knownSum += 2 * elem.count;
    } else if (elem.symbol === 'Al') {
      knownSum += 3 * elem.count;
    } else {
      // Unknown element - we'll need to solve for it
      unknownCount++;
      unknownMultiplier = elem.count;
      unknownElement = elem.symbol;
    }
  }

  if (unknownCount === 1 && unknownElement === targetElement) {
    // Solve: knownSum + (oxidationState * multiplier) = charge
    return (charge - knownSum) / unknownMultiplier;
  }

  // Can't determine - return null
  return null;
}

/**
 * Identify which elements are oxidized and which are reduced
 */
export function identifyRedoxChanges(equation) {
  const changes = [];
  const elements = getAllElements(equation);

  for (const element of elements) {
    // Find oxidation states in reactants
    const reactantStates = [];
    for (const compound of equation.reactants) {
      if (compound.elements.some(e => e.symbol === element)) {
        const state = calculateOxidationState(compound, element);
        if (state !== null) {
          reactantStates.push({ compound, state });
        }
      }
    }

    // Find oxidation states in products
    const productStates = [];
    for (const compound of equation.products) {
      if (compound.elements.some(e => e.symbol === element)) {
        const state = calculateOxidationState(compound, element);
        if (state !== null) {
          productStates.push({ compound, state });
        }
      }
    }

    // Check for changes
    for (const r of reactantStates) {
      for (const p of productStates) {
        if (Math.abs(r.state - p.state) > 0.001) {
          changes.push({
            element,
            from: r.state,
            to: p.state,
            change: p.state - r.state,
            type: p.state > r.state ? 'oxidation' : 'reduction',
            reactantCompound: r.compound,
            productCompound: p.compound,
          });
        }
      }
    }
  }

  return changes;
}

/**
 * Create a half-reaction from redox change info
 */
function createHalfReaction(change, equation) {
  const { element, from, to, type, reactantCompound, productCompound } = change;
  const electronsTransferred = Math.abs(to - from);

  return {
    type,
    element,
    fromState: from,
    toState: to,
    electrons: electronsTransferred,
    reactant: reactantCompound,
    product: productCompound,
    balanced: false,
  };
}

/**
 * Balance a half-reaction in acidic solution
 * Steps:
 * 1. Balance the element being oxidized/reduced
 * 2. Balance oxygen by adding H2O
 * 3. Balance hydrogen by adding H+
 * 4. Balance charge by adding electrons
 */
export function balanceHalfReactionAcidic(halfReaction) {
  const steps = [];
  const { element, reactant, product, type } = halfReaction;

  // Create working copies
  let reactants = [{ ...reactant, coefficient: 1 }];
  let products = [{ ...product, coefficient: 1 }];

  // Step 1: Balance the main element
  const reactantCount = getElementTotal(reactants, element);
  const productCount = getElementTotal(products, element);

  if (reactantCount !== productCount) {
    const lcm = lcmOf(reactantCount, productCount);
    reactants[0].coefficient = lcm / reactantCount;
    products[0].coefficient = lcm / productCount;

    steps.push({
      action: `Balance ${element}`,
      detail: `Multiply to get equal ${element} atoms`,
    });
  }

  // Step 2: Balance oxygen by adding H2O
  const oReactant = getElementTotal(reactants, 'O');
  const oProduct = getElementTotal(products, 'O');

  if (oReactant > oProduct) {
    products.push(createWater(oReactant - oProduct));
    steps.push({
      action: 'Balance O with H₂O',
      detail: `Add ${oReactant - oProduct} H₂O to products`,
    });
  } else if (oProduct > oReactant) {
    reactants.push(createWater(oProduct - oReactant));
    steps.push({
      action: 'Balance O with H₂O',
      detail: `Add ${oProduct - oReactant} H₂O to reactants`,
    });
  }

  // Step 3: Balance hydrogen by adding H+
  const hReactant = getElementTotal(reactants, 'H');
  const hProduct = getElementTotal(products, 'H');

  if (hReactant > hProduct) {
    products.push(createHPlus(hReactant - hProduct));
    steps.push({
      action: 'Balance H with H⁺',
      detail: `Add ${hReactant - hProduct} H⁺ to products`,
    });
  } else if (hProduct > hReactant) {
    reactants.push(createHPlus(hProduct - hReactant));
    steps.push({
      action: 'Balance H with H⁺',
      detail: `Add ${hProduct - hReactant} H⁺ to reactants`,
    });
  }

  // Step 4: Balance charge with electrons
  const reactantCharge = getTotalCharge(reactants);
  const productCharge = getTotalCharge(products);
  const chargeDiff = reactantCharge - productCharge;

  if (chargeDiff !== 0) {
    if (chargeDiff > 0) {
      // Add electrons to reactants
      reactants.push(createElectron(chargeDiff));
      steps.push({
        action: 'Balance charge with e⁻',
        detail: `Add ${chargeDiff} e⁻ to reactants`,
      });
    } else {
      // Add electrons to products
      products.push(createElectron(-chargeDiff));
      steps.push({
        action: 'Balance charge with e⁻',
        detail: `Add ${-chargeDiff} e⁻ to products`,
      });
    }
  }

  return {
    ...halfReaction,
    reactants,
    products,
    steps,
    balanced: true,
    electronCount: Math.abs(chargeDiff),
  };
}

/**
 * Balance a half-reaction in basic solution
 * Same as acidic, then add OH- to neutralize H+
 */
export function balanceHalfReactionBasic(halfReaction) {
  // First balance in acidic solution
  const acidicResult = balanceHalfReactionAcidic(halfReaction);
  const steps = [...acidicResult.steps];

  let reactants = [...acidicResult.reactants];
  let products = [...acidicResult.products];

  // Count H+ on each side
  const hPlusReactants = reactants.filter(c => c.formula === 'H+' || (c.elements?.length === 1 && c.elements[0].symbol === 'H' && c.charge === 1));
  const hPlusProducts = products.filter(c => c.formula === 'H+' || (c.elements?.length === 1 && c.elements[0].symbol === 'H' && c.charge === 1));

  const hPlusReactantCount = hPlusReactants.reduce((sum, c) => sum + (c.coefficient || 1), 0);
  const hPlusProductCount = hPlusProducts.reduce((sum, c) => sum + (c.coefficient || 1), 0);

  // Add OH- to neutralize H+
  if (hPlusReactantCount > 0) {
    // Add OH- to both sides to neutralize H+ on reactant side
    reactants = reactants.filter(c => c.formula !== 'H+' && !(c.elements?.length === 1 && c.elements[0].symbol === 'H' && c.charge === 1));
    reactants.push(createOH(hPlusReactantCount)); // OH- replaces H+
    products.push(createWater(hPlusReactantCount)); // H+ + OH- -> H2O

    steps.push({
      action: 'Neutralize H⁺ with OH⁻',
      detail: `Add ${hPlusReactantCount} OH⁻ to both sides`,
    });
  }

  if (hPlusProductCount > 0) {
    products = products.filter(c => c.formula !== 'H+' && !(c.elements?.length === 1 && c.elements[0].symbol === 'H' && c.charge === 1));
    products.push(createOH(hPlusProductCount));
    reactants.push(createWater(hPlusProductCount));

    steps.push({
      action: 'Neutralize H⁺ with OH⁻',
      detail: `Add ${hPlusProductCount} OH⁻ to both sides`,
    });
  }

  // Simplify H2O if it appears on both sides
  const h2oReactants = reactants.filter(c => c.formula === 'H2O');
  const h2oProducts = products.filter(c => c.formula === 'H2O');

  if (h2oReactants.length > 0 && h2oProducts.length > 0) {
    const reactantH2O = h2oReactants.reduce((sum, c) => sum + (c.coefficient || 1), 0);
    const productH2O = h2oProducts.reduce((sum, c) => sum + (c.coefficient || 1), 0);

    reactants = reactants.filter(c => c.formula !== 'H2O');
    products = products.filter(c => c.formula !== 'H2O');

    const diff = reactantH2O - productH2O;
    if (diff > 0) {
      reactants.push(createWater(diff));
    } else if (diff < 0) {
      products.push(createWater(-diff));
    }

    steps.push({
      action: 'Simplify H₂O',
      detail: 'Cancel H₂O molecules on both sides',
    });
  }

  return {
    ...acidicResult,
    reactants,
    products,
    steps,
    isBasic: true,
  };
}

/**
 * Balance full redox equation using half-reaction method
 */
export function balanceRedoxEquation(equation, options = {}) {
  const { solution = 'acidic', showSteps = true } = options;
  const steps = [];

  try {
    // Step 1: Identify redox changes
    const redoxChanges = identifyRedoxChanges(equation);

    if (redoxChanges.length === 0) {
      return {
        success: false,
        error: 'No redox changes detected. This may not be a redox equation.',
        isRedox: false,
      };
    }

    steps.push({
      description: 'Identify oxidation state changes',
      detail: redoxChanges.map(c => `${c.element}: ${c.from} → ${c.to} (${c.type})`).join(', '),
    });

    // Separate into oxidation and reduction
    const oxidations = redoxChanges.filter(c => c.type === 'oxidation');
    const reductions = redoxChanges.filter(c => c.type === 'reduction');

    if (oxidations.length === 0 || reductions.length === 0) {
      return {
        success: false,
        error: 'Need both oxidation and reduction half-reactions',
        isRedox: true,
        changes: redoxChanges,
      };
    }

    // Step 2: Create and balance half-reactions
    const halfReactions = [];

    for (const ox of oxidations) {
      const halfRx = createHalfReaction(ox, equation);
      const balanced = solution === 'basic'
        ? balanceHalfReactionBasic(halfRx)
        : balanceHalfReactionAcidic(halfRx);
      halfReactions.push(balanced);
    }

    for (const red of reductions) {
      const halfRx = createHalfReaction(red, equation);
      const balanced = solution === 'basic'
        ? balanceHalfReactionBasic(halfRx)
        : balanceHalfReactionAcidic(halfRx);
      halfReactions.push(balanced);
    }

    steps.push({
      description: 'Balance half-reactions',
      halfReactions: halfReactions.map(hr => ({
        type: hr.type,
        element: hr.element,
        electrons: hr.electronCount,
        steps: hr.steps,
      })),
    });

    // Step 3: Equalize electrons
    const oxHalfRx = halfReactions.find(hr => hr.type === 'oxidation');
    const redHalfRx = halfReactions.find(hr => hr.type === 'reduction');

    const oxElectrons = oxHalfRx.electronCount;
    const redElectrons = redHalfRx.electronCount;
    const lcmElectrons = lcmOf(oxElectrons, redElectrons);

    const oxMultiplier = lcmElectrons / oxElectrons;
    const redMultiplier = lcmElectrons / redElectrons;

    steps.push({
      description: 'Equalize electrons',
      detail: `LCM of ${oxElectrons} and ${redElectrons} = ${lcmElectrons}. ` +
              `Multiply oxidation by ${oxMultiplier}, reduction by ${redMultiplier}`,
    });

    // Step 4: Combine half-reactions
    // Build coefficient map for original compounds
    const coefficients = {};

    // Apply multipliers to half-reaction compounds
    for (const r of oxHalfRx.reactants) {
      if (r.id) {
        coefficients[r.id] = (coefficients[r.id] || 0) + (r.coefficient || 1) * oxMultiplier;
      }
    }
    for (const p of oxHalfRx.products) {
      if (p.id) {
        coefficients[p.id] = (coefficients[p.id] || 0) + (p.coefficient || 1) * oxMultiplier;
      }
    }
    for (const r of redHalfRx.reactants) {
      if (r.id) {
        coefficients[r.id] = (coefficients[r.id] || 0) + (r.coefficient || 1) * redMultiplier;
      }
    }
    for (const p of redHalfRx.products) {
      if (p.id) {
        coefficients[p.id] = (coefficients[p.id] || 0) + (p.coefficient || 1) * redMultiplier;
      }
    }

    steps.push({
      description: 'Combine half-reactions',
      detail: 'Add half-reactions together, electrons cancel',
    });

    return {
      success: true,
      coefficients,
      steps,
      halfReactions: {
        oxidation: {
          ...oxHalfRx,
          multiplier: oxMultiplier,
        },
        reduction: {
          ...redHalfRx,
          multiplier: redMultiplier,
        },
      },
      isRedox: true,
      solution,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      isRedox: true,
    };
  }
}

// Helper functions

function createWater(coefficient) {
  return {
    id: `h2o-${Date.now()}-${Math.random()}`,
    formula: 'H2O',
    elements: [
      { symbol: 'H', count: 2 },
      { symbol: 'O', count: 1 },
    ],
    charge: 0,
    coefficient,
  };
}

function createHPlus(coefficient) {
  return {
    id: `hplus-${Date.now()}-${Math.random()}`,
    formula: 'H+',
    elements: [{ symbol: 'H', count: 1 }],
    charge: 1,
    coefficient,
  };
}

function createOH(coefficient) {
  return {
    id: `oh-${Date.now()}-${Math.random()}`,
    formula: 'OH-',
    elements: [
      { symbol: 'O', count: 1 },
      { symbol: 'H', count: 1 },
    ],
    charge: -1,
    coefficient,
  };
}

function createElectron(coefficient) {
  return {
    id: `e-${Date.now()}-${Math.random()}`,
    formula: 'e-',
    elements: [{ symbol: 'e', count: 1 }],
    charge: -1,
    coefficient,
    isElectron: true,
  };
}

function getElementTotal(compounds, element) {
  let total = 0;
  for (const compound of compounds) {
    const coeff = compound.coefficient || 1;
    const elem = compound.elements?.find(e => e.symbol === element);
    if (elem) {
      total += elem.count * coeff;
    }
  }
  return total;
}

function getTotalCharge(compounds) {
  let total = 0;
  for (const compound of compounds) {
    const coeff = compound.coefficient || 1;
    total += (compound.charge || 0) * coeff;
  }
  return total;
}

function gcdOf(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function lcmOf(a, b) {
  return Math.abs(a * b) / gcdOf(a, b);
}

/**
 * Format a half-reaction for display
 */
export function formatHalfReaction(halfReaction) {
  const formatSide = (compounds) => {
    return compounds.map(c => {
      const coeff = c.coefficient > 1 ? c.coefficient : '';
      return `${coeff}${c.formula}`;
    }).join(' + ');
  };

  const reactantStr = formatSide(halfReaction.reactants);
  const productStr = formatSide(halfReaction.products);

  return `${reactantStr} → ${productStr}`;
}

export default {
  calculateOxidationState,
  identifyRedoxChanges,
  balanceHalfReactionAcidic,
  balanceHalfReactionBasic,
  balanceRedoxEquation,
  formatHalfReaction,
};
