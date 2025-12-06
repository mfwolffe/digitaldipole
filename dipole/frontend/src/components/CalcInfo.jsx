export function AvoInfo() {
  return (
    <>
      <p className="text-left mb-1">
        Avogadro's law describes the observation that equal volumes of ideal
        gases have the same number of molecules provided temperature and
        pressure are held constant. Additionally, the amount of a gas sample is
        directly proportional to the sample's volume.
      </p>
      <p>Expressed symbolically,</p>
      <p className="text-center">{"$$V \\; \\alpha \\; n$$"}</p>
      <p className="mt-2">Which implies {"\\(\\frac{V}{n} = k \\; \\)"} for some constant {"\\(k\\)"}.</p>
      <p className="text-start mt-3">
        The law may be further used to determine an unknown quantity in the case
        of the same substance held in two different sets of conditions (provided
        pressure and temperature held equal).
      </p>
      <p>Which, expressed symbolically, is,</p>
      <p className="text-center">{"$$\\frac{V_1}{n_1} \\; = \\; \\frac{V_2}{n_2}$$"}</p>
    </>
  );
}

export function AmontonInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Amonton's Law, sometimes referred to as Gay-Lussac's Law, describes the
        direct relationship between the temperature and pressure of a sample of
        gas, so long as the container in which the sample is held is suitably
        rigid thereby keeping volume fixed, and amount of gas fixed as well.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$P \\; \\alpha \\; T$$"}</p>
      <p className="mt-2 text-center">And so it follows that {"\\(\\frac{P}{T} = k \\; \\)"} for some constant {"\\(k\\)"}</p>
      <p className="text-start mb-0">
        And this allows the comparison of a gas sample following a change in
        conditions if volume and amount of gas are held constant:
      </p>
      <p className="text-center">{"$$\\frac{P_1}{T_1} \\; = \\; \\frac{P_2}{T_2}$$"}</p>
    </>
  );
}

export function BoyleInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Boyle's law describes the observation that the pressure and volume of an
        ideal gas are inversely proportional, so long as the amount of gas and
        temperature are held constant.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$P \\; \\alpha \\; \\frac{1}{V}$$"}</p>
      <p className="mt-2 text-center">And so it follows that {"\\(PV = k \\; \\)"} for some constant {"\\(k\\)"}</p>
      <p className="text-start mb-0">
        This allows comparison of the same gas sample under different
        conditions, so long as the temperature and quantity of gas remain the
        same:
      </p>
      <p className="text-center">{"$$P_{1}V_{1} \\; = \\; P_{2}V_{2}$$"}</p>
    </>
  );
}

export function CharlesInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Charles' Law describes the relationship between the temperature of a gas
        and the volume it occupies, so long as the sample is contained in a
        suitably nonrigid container and pressure and amount of gas are held
        constant.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$V \\; \\alpha \\; T$$"}</p>
      <p className="mt-2 text-center">And so it follows that {"\\(\\frac{V}{T} = k \\; \\)"} for some constant {"\\(k\\)"}</p>
      <p className="text-start mb-0">
        As such, this allows comparison of the same gas sample under different
        conditions, so long as the pressure and amount of gas remain the same:
      </p>
      <p className="text-center">{"$$\\frac{V_1}{T_1} \\; = \\; \\frac{V_2}{T_2}$$"}</p>
    </>
  );
}

export function IdealInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Like the combined gas law, the ideal gas law combines the simpler laws
        describing ideal gases, as such the other laws can be derived from the
        ideal gas equation:
      </p>
      <p className="text-center">{"$$PV \\; = \\; nRT$$"}</p>
      <p className="text-center mt-3">where {"\\(R\\)"} is the ideal gas constant.</p>
      <p className="mt-2">Rearranging, we have:</p>
      <p className="text-center">{"$$\\frac{PV}{nRT} \\; = \\; 1$$"}</p>
      <p className="text-start mb-0 mt-2">
        The quotient on the lefthand side is known as the <em>compression factor</em>,
        and can be used as an estimate of how ideal a gas is. The closer this compression
        factor is to 1, the more ideally the gas will behave.
      </p>
    </>
  );
}

export function CombinedInfo() {
  return (
    <>
      <p className="text-start mb-1">
        As the name suggests, the combined gas law takes the basic laws
        describing ideal gases and constructions a single equation relating all
        properties thus discussed. The ideal gas constant, {"\\(R\\)"}, and the
        number of moles are ommitted as they are generally held
        constant thereby leading to cancelation.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\frac{P_1V_1}{T_1} \\; = \\; \\frac{P_2V_2}{T_2} $$"}</p>
    </>
  );
}

export function GenInfo1() {
  return (
    <>
      <p className="text-left">
        Gas Laws are models which describe the relationships between pressure,
        volume, temperature, and amount of gas for a given sample. The first
        such law was formulated in the late 17th century by English scientist
        Robert Boyle. These discoveries were corroborated, and understood
        further as kinetic molecular theory was formulating.
      </p>
      <p className="text-left">
        By the end of the 19th century, three other laws describing
        relationships between gas properties were formulated. They were Boyle's
        Law, Avogadro's Law, Charles' Law, and Amonto's Law. All four of
        these laws however make the assumption that the gases being modeled are{" "}
        <em>ideal</em>.
      </p>
    </>
  );
}

export function GenInfo2() {
  return (
    <>
      <p className="text-left">
        Ideal gases, in contrast to <em>real gases</em>, are theoretical
        constructs, yet are nonetheless useful in describing gas behavior at the
        macroscopic level. Many real gases behave similarly to ideal gases if
        they are held in fairly standard conditions of temperature and pressure.
        An ideal gas is formally defined as one in which the following
        conditions hold:
      </p>
      <dl className="text-left">
        <dt>All collisions are perfectly elastic</dt>
        <dd>
          For a collision between two particles or one particle and some object
          to be considered elastic, the total kinetic energy before and after
          the collision must remain the same.
        </dd>

        <dt>Molecules are not subject to standard intermolecular forces</dt>
        <dd>
          Contrary to intramolecular forces such as covalent bonding,
          intermolecular forces describe the attractive and repulsive forces
          that keep molecules in a specific state. In an ideal gas, particles
          are not subject to these forces.
        </dd>

        <dt>Molecules themselves have negligible volume</dt>
        <dd>
          To put it simply, the particles of gas do not occupy space within
          their container.
        </dd>

        <dt>
          The motion of particles is nondeterministic and adheres to Newton's
          Laws
        </dt>
        <dd>
          For the particles to exhibit nondeterministic motion is simply to say
          that their movements are random and unpredictable.
        </dd>
      </dl>
    </>
  );
}

export function ThermInfo1() {
  return (
    <>
      <p className="text-left">
        Thermodynamics describes the relationships between heat (energy) and work within systems.
        There exist countless thermodynamic properties, and by definition, they specify the state
        of a system.
        This list of properties includes, but is not limited to:
        <dl className="mt-2">
          <dt>Density, {"\\(\\rho\\)"}</dt>
          <dd>
            a substance's mass per unit volume, often expressed 
            in units of {"\\(\\hspace{1mm} \\text{kg/m}^3\\)"}
          </dd>
          <dt>Internal energy, {"\\(U\\)"}</dt>
          <dd>
            the energy contained within a thermodynamic system, 
            measured as the energy necessary to change the system from its standard to present state, 
            often expressed in units of {"\\(\\text{J}\\)"}
          </dd>
          <dt>Specific Heat Capacity, {"\\(\\hspace{1mm} C_{sp}\\)"}</dt>
          <dd>
            the amount of heat that must be added to 
            one unit of mass of the substance in order to cause an increase of one unit in 
            temperature, often expressed in units of {"\\(\\hspace{1mm} \\text{J/g} \\hspace{1mm} ^{\\circ} \\text{C}\\)"}
          </dd>
          <dt>Enthalpy, {"\\(H\\)"}</dt>
          <dd>
            the sum of a system's internal energy and the product of its pressure and volume, 
            though typically the latter are considered negligible, often
            expressed in units of {"\\(\\hspace{1mm} \\text{J}\\)"}
          </dd>
          <dt>Entropy, {"\\(S\\)"}</dt>
          <dd>often erroneously referred to as states of 'disorder' or 
            'chaos' in popular science, entropy measures the degree to which the energy of atoms and molecules
            disperses, typically expressed in units of {"\\(\\hspace{1mm} \\text{J/K}\\)"}
          </dd>
        </dl>
      </p>
      <p className="text-left">
        The systems referenced above adhere to the <strong>laws of thermodynamics</strong>,
        four laws which use thermodynamic properties to characterize systems in thermodynamic equilibrium.
      </p>
    </>
  );
}

export function ThermInfo2() {
  return (
    <>
      <p className="text-left">
        Conceptions regarding thermodynamics date back to antiquity, yet the formal laws described below
        were formualted and expanded on throughout the 19th and 20th centuries.
      </p>
      <dl className="text-left">
        
        <dt>Zeroeth Law of Thermodynamics</dt>
        <dd>
          Coined in the 1930s by Ralph fowler, the zeroeth law establishes transitivity 
          of thermal equilibrium across multiple systems.
        </dd>

        <dt>First Law of Thermodynamics</dt>
        <dd>
          The first law of thermodynamics is an extension of the conservation of energy. In simple terms, 
          it asserts that the total energy of a system is constant. While energy within systems can be converted,
          energy can neither be created nor destroyed.
        </dd>

        <dt>Second Law of Thermodynamics</dt>
        <dd>
          <p className="text-left">
            The second law describes both the tendency of systems to progress to
            homogeneity of matter and energy. Integral to the escond law, is the irreversibility
            of this tendency toward homogeneity. A consequence of our understanding of the second
            law is our understanding of the concept of entropy.
          </p>
            
        </dd>

        <dt>Third Law of Thermodynamics</dt>
        <dd>
          The third law states that as a system approaches absolute zero, its entropy approaches
          some constant value (need not be zero). At absolute zero, thermal energy is minimized and the system is said 
          to be in its <em>ground state</em>. The constant value is known as the system's <em>residual entropy</em>.</dd>
      </dl>
    </>
  );
}

export function StateHeat() {
  return (
    <>
      <p className="text-left">
        Enthalpy is the sum of the internal energy of a system and the product of its pressure and volume:
      </p>
      <p className="text-center">{"$$\\text{H} \\; = \\; \\text{U} + \\text{PV}$$"}</p>
      <p className="text-left">
        However, measuring the enthalpy of a system directly is infeasible, and so it is common to measure the
        heat evolved from a system during some process. Changes in pressure and volume during measurements are 
        often considered negligible and so the change in enthalpy is considered essentially equal to the change in heat
        of the system:
      </p>
      <p className="text-center">{"$$\\Delta\\text{H} \\; = \\; \\Delta\\text{U} + \\Delta\\text{PV} \\; \\approx \\; \\text{q}$$"}</p>
      <p className="text-left">The variable {"\\(\\text{q}\\)"} is commonly used to represent the heat change of a system and is given the formula,</p>
      <p className="text-center">{"$$\\text{q} \\; = \\; m C_{sp} \\Delta T$$"}</p>
    </>
  )
}

export function EntropyInfo() {
  return (
    <>
      <p className="text-left">
        Entropy is a measure of the degree to which the energy of a system has dispersed such that it is 
        no longer available to perform mechanical work.
      </p>
      <p className="text-center">{"$$ S \\; = \\; k_{b} + \\ln\\Omega$$"}</p>
      <p className="text-left">
        Where {"\\(k_{b}\\)"} is the Boltzmann constant, and {"\\(\\Omega\\)"} is the number of distinct state configurations.
        Entropy is often erroneously described in popular science outlets as a measure of disorder or chaos. 
      </p>
    </>
  )
}

export function GibbsInfo() {
  return (
    <>
      <p className="text-left">
        Gibbs Free Energy is a thermodynamic function that is proportional to the negative of
        the change in entropy of the universe. It enables us to determine the spontaneity of a
        reaction. Below is the equation for the free energy under standard state:
      </p>
      <p className="text-center">{"$$ \\Delta G^\\circ \\; = \\; \\Delta H^\\circ - T\\Delta S^\\circ $$"}</p>
      <p className="text-left">
        When {"\\(\\Delta G < 0\\)"}, a chemmical reaction is spontaneous. When {"\\(\\Delta G > 0\\)"},
        the reaction is not spontaneous
      </p>
    </>
  )
}

// === New Gas Law Calculators ===

export function GasDensityInfo() {
  return (
    <>
      <p className="text-left mb-1">
        The density of a gas can be derived from the ideal gas law. Starting with {"\\(PV = nRT\\)"} and
        recognizing that {"\\(n = \\frac{m}{M}\\)"} (mass divided by molar mass), we can rearrange to
        find the density {"\\(d = \\frac{m}{V}\\)"}:
      </p>
      <p className="text-center">{"$$d \\; = \\; \\frac{PM}{RT}$$"}</p>
      <p className="text-left mt-2">
        This shows that gas density is directly proportional to pressure and molar mass, and inversely
        proportional to temperature. Unlike liquids and solids, gas density varies significantly with
        conditions.
      </p>
    </>
  );
}

export function GrahamInfo() {
  return (
    <>
      <p className="text-left mb-1">
        Graham's Law of Effusion states that the rate at which a gas escapes through a small hole
        (effuses) is inversely proportional to the square root of its molar mass. For two gases:
      </p>
      <p className="text-center">{"$$\\frac{r_1}{r_2} \\; = \\; \\sqrt{\\frac{M_2}{M_1}}$$"}</p>
      <p className="text-left mt-2">
        This means lighter gases effuse faster than heavier gases. The same relationship applies to
        diffusion rates. This principle is used in isotope separation and explains why helium balloons
        deflate faster than air-filled ones.
      </p>
    </>
  );
}

export function DaltonInfo() {
  return (
    <>
      <p className="text-left mb-1">
        Dalton's Law of Partial Pressures states that the total pressure exerted by a mixture of
        non-reacting gases is equal to the sum of the partial pressures of the individual gases:
      </p>
      <p className="text-center">{"$$P_{total} \\; = \\; P_1 + P_2 + P_3 + \\ldots$$"}</p>
      <p className="text-left mt-2">
        Each gas in a mixture behaves independently and exerts pressure as if it alone occupied the
        container. The partial pressure of a gas is proportional to its mole fraction in the mixture.
      </p>
    </>
  );
}

// === New Thermodynamics Calculators ===

export function EntropyChangeInfo() {
  return (
    <>
      <p className="text-left mb-1">
        For a reversible process at constant temperature, the change in entropy is defined as the
        heat transferred divided by the absolute temperature:
      </p>
      <p className="text-center">{"$$\\Delta S \\; = \\; \\frac{q_{rev}}{T}$$"}</p>
      <p className="text-left mt-2">
        This relationship is fundamental to the second law of thermodynamics. For irreversible
        processes, the entropy change of the universe is always positive. Units are typically
        J/K or J/(mol·K).
      </p>
    </>
  );
}

export function WorkPVInfo() {
  return (
    <>
      <p className="text-left mb-1">
        Pressure-volume work is the work done when a system expands or compresses against an
        external pressure. For a process at constant external pressure:
      </p>
      <p className="text-center">{"$$w \\; = \\; -P\\Delta V$$"}</p>
      <p className="text-left mt-2">
        The negative sign indicates that when a system expands ({"\\(\\Delta V > 0\\)"}), it does
        work on the surroundings (w is negative). When compressed, work is done on the system
        (w is positive).
      </p>
    </>
  );
}

export function FirstLawInfo() {
  return (
    <>
      <p className="text-left mb-1">
        The First Law of Thermodynamics is a statement of conservation of energy. The change in
        internal energy of a system equals the heat added to the system plus the work done on it:
      </p>
      <p className="text-center">{"$$\\Delta U \\; = \\; q + w$$"}</p>
      <p className="text-left mt-2">
        Internal energy {"\\(U\\)"} is a state function—it depends only on the current state, not the
        path taken. Heat {"\\(q\\)"} and work {"\\(w\\)"} are path-dependent. This law is the basis
        for understanding energy transformations in chemical and physical processes.
      </p>
    </>
  );
}

export function MolarHeatCapacityInfo() {
  return (
    <>
      <p className="text-left mb-1">
        Molar heat capacity describes the heat required to raise the temperature of one mole of a
        substance by one degree. At constant pressure:
      </p>
      <p className="text-center">{"$$q \\; = \\; nC_p\\Delta T$$"}</p>
      <p className="text-left mt-2">
        Where {"\\(n\\)"} is the number of moles and {"\\(C_p\\)"} is the molar heat capacity at
        constant pressure. This is related to specific heat capacity by {"\\(C_p = M \\cdot c\\)"}
        where {"\\(M\\)"} is molar mass.
      </p>
    </>
  );
}

export function ClausiusClapeyronInfo() {
  return (
    <>
      <p className="text-left mb-1">
        The Clausius-Clapeyron equation describes how vapor pressure changes with temperature.
        It's essential for understanding phase transitions and boiling points at different pressures.
      </p>
      <p className="text-center">{"$$\\ln\\left(\\frac{P_2}{P_1}\\right) = -\\frac{\\Delta H_{vap}}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$"}</p>
      <p className="text-left mt-2">
        Where {"\\(\\Delta H_{vap}\\)"} is the enthalpy of vaporization, {"\\(R\\)"} is the gas constant
        (8.314 J/(mol·K)), and {"\\(P_1, P_2\\)"} are vapor pressures at temperatures {"\\(T_1, T_2\\)"}.
      </p>
      <p className="text-left mt-2">
        This equation can predict boiling points at different altitudes or estimate vapor pressures
        at various temperatures.
      </p>
    </>
  );
}

export function IsothermalWorkInfo() {
  return (
    <>
      <p className="text-left mb-1">
        In an isothermal (constant temperature) reversible expansion or compression, work is
        calculated using the natural logarithm of the volume ratio:
      </p>
      <p className="text-center">{"$$w = -nRT\\ln\\left(\\frac{V_2}{V_1}\\right)$$"}</p>
      <p className="text-left mt-2">
        For expansion ({"\\(V_2 > V_1\\)"}), work is negative (system does work on surroundings).
        For compression ({"\\(V_2 < V_1\\)"}), work is positive (surroundings do work on system).
      </p>
      <p className="text-left mt-2">
        This represents the maximum work obtainable from an isothermal process, achieved only
        in the idealized reversible limit.
      </p>
    </>
  );
}

export function ArrheniusInfo() {
  return (
    <>
      <p className="text-start mb-1">
        The Arrhenius equation describes the observation that reaction rate constants
        increase exponentially with temperature. This relationship provides insight
        into the energy barrier (activation energy) that must be overcome for a
        reaction to proceed.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$k = Ae^{-E_a/RT}$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(A\\)"} is the pre-exponential factor and {"\\(E_a\\)"} is the activation energy.
      </p>
      <p className="text-start mb-0 mt-3">
        For comparing rate constants at two different temperatures, the two-point
        form proves more practical:
      </p>
      <p className="text-center">{"$$\\ln\\left(\\frac{k_2}{k_1}\\right) = -\\frac{E_a}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$"}</p>
    </>
  );
}

export function HalfLifeInfo() {
  return (
    <>
      <p className="text-start mb-1">
        The half-life of a reaction describes the time required for the concentration
        of a reactant to decrease to half of its initial value. For first-order
        reactions, the half-life is notably independent of the initial concentration.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$t_{1/2} = \\frac{\\ln(2)}{k}$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(k\\)"} is the first-order rate constant.
      </p>
      <p className="text-start mb-0 mt-3">
        This constant half-life is characteristic of first-order processes and is
        widely applied in radioactive decay, pharmacokinetics, and chemical kinetics.
      </p>
    </>
  );
}

export function SecondOrderInfo() {
  return (
    <>
      <p className="text-start mb-1">
        For a second-order reaction with a single reactant, the rate of reaction
        is proportional to the square of the reactant concentration. The integrated
        rate law takes a characteristic reciprocal form.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\frac{1}{[A]} = \\frac{1}{[A]_0} + kt$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\([A]_0\\)"} is the initial concentration and {"\\(k\\)"} is the second-order rate constant.
      </p>
      <p className="text-start mb-0 mt-3">
        A plot of {"\\(1/[A]\\)"} versus time yields a straight line with slope {"\\(k\\)"},
        providing a method to determine the rate constant experimentally.
      </p>
    </>
  );
}

export function FirstOrderInfo() {
  return (
    <>
      <p className="text-start mb-1">
        For a first-order reaction, the rate of reaction is directly proportional
        to the concentration of the reactant. The integrated rate law takes a
        logarithmic form relating concentration to time.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\ln[A] = \\ln[A]_0 - kt$$"}</p>
      <p className="mt-2 text-center">
        Which may also be written as {"\\([A] = [A]_0 e^{-kt}\\)"}.
      </p>
      <p className="text-start mb-0 mt-3">
        A plot of {"\\(\\ln[A]\\)"} versus time yields a straight line with slope {"\\(-k\\)"},
        providing a method to determine the rate constant and confirm first-order behavior.
      </p>
    </>
  );
}

// ===== SOLUTIONS INFO COMPONENTS =====

export function MolarityInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Molarity describes the concentration of a solution as the number of moles
        of solute dissolved per liter of solution. It is one of the most commonly
        used concentration units in chemistry.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$M = \\frac{n}{V}$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(n\\)"} is moles of solute and {"\\(V\\)"} is volume of solution in liters.
      </p>
      <p className="text-start mb-0 mt-3">
        Molarity is temperature-dependent since solution volume changes with
        temperature, unlike molality which is based on mass of solvent.
      </p>
    </>
  );
}

export function DilutionInfo() {
  return (
    <>
      <p className="text-start mb-1">
        The dilution equation describes the relationship between the concentration
        and volume of a solution before and after dilution. The total amount of
        solute remains constant during dilution.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$M_1 V_1 = M_2 V_2$$"}</p>
      <p className="mt-2 text-center">
        Where subscript 1 refers to the concentrated solution and subscript 2 to the diluted solution.
      </p>
      <p className="text-start mb-0 mt-3">
        This relationship follows directly from the conservation of moles: since
        {"\\(n = MV\\)"}, and no solute is added or removed, the product {"\\(MV\\)"} must remain constant.
      </p>
    </>
  );
}

export function OsmoticPressureInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Osmotic pressure is a colligative property describing the pressure required
        to prevent the flow of solvent across a semipermeable membrane from a region
        of lower solute concentration to higher concentration.
      </p>
      <p className="mt-0">Expressed symbolically by the van't Hoff equation,</p>
      <p className="text-center">{"$$\\Pi = MRT$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(\\Pi\\)"} is osmotic pressure, {"\\(M\\)"} is molarity, {"\\(R\\)"} is the gas constant, and {"\\(T\\)"} is temperature.
      </p>
      <p className="text-start mb-0 mt-3">
        This equation bears striking similarity to the ideal gas law and is used
        extensively in biology and medicine to understand cellular processes.
      </p>
    </>
  );
}

export function RaoultInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Raoult's Law describes the vapor pressure of an ideal solution as
        proportional to the mole fraction of solvent. The presence of a nonvolatile
        solute lowers the vapor pressure of the solvent.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$P = \\chi \\cdot P^\\circ$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(P\\)"} is the vapor pressure, {"\\(\\chi\\)"} is the mole fraction, and {"\\(P^\\circ\\)"} is the pure solvent vapor pressure.
      </p>
      <p className="text-start mb-0 mt-3">
        Deviations from Raoult's Law indicate non-ideal behavior due to
        solute-solvent interactions differing from solvent-solvent interactions.
      </p>
    </>
  );
}

export function BoilingPointElevationInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Boiling point elevation is a colligative property whereby the boiling point
        of a solution is higher than that of the pure solvent. The elevation depends
        only on the number of solute particles, not their identity.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\Delta T_b = K_b \\cdot m \\cdot i$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(K_b\\)"} is the ebullioscopic constant, {"\\(m\\)"} is molality, and {"\\(i\\)"} is the van't Hoff factor.
      </p>
      <p className="text-start mb-0 mt-3">
        The van't Hoff factor {"\\(i\\)"} accounts for electrolyte dissociation: for
        non-electrolytes {"\\(i = 1\\)"}, while for NaCl {"\\(i \\approx 2\\)"}.
      </p>
    </>
  );
}

export function FreezingPointDepressionInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Freezing point depression is a colligative property whereby the freezing
        point of a solution is lower than that of the pure solvent. This principle
        underlies the use of salt on icy roads and antifreeze in engines.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\Delta T_f = K_f \\cdot m \\cdot i$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(K_f\\)"} is the cryoscopic constant, {"\\(m\\)"} is molality, and {"\\(i\\)"} is the van't Hoff factor.
      </p>
      <p className="text-start mb-0 mt-3">
        Like boiling point elevation, the magnitude of depression depends on the
        number of solute particles rather than their chemical nature.
      </p>
    </>
  );
}

// ===== ELECTROCHEMISTRY INFO COMPONENTS =====

export function FaradayInfo() {
  return (
    <>
      <p className="text-start mb-1">
        Faraday's Law of Electrolysis describes the quantitative relationship
        between the amount of substance deposited at an electrode and the quantity
        of electric charge passed through the electrolyte.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$m = \\frac{M \\cdot I \\cdot t}{n \\cdot F}$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(M\\)"} is molar mass, {"\\(I\\)"} is current, {"\\(t\\)"} is time, {"\\(n\\)"} is electrons transferred, and {"\\(F\\)"} is Faraday's constant.
      </p>
      <p className="text-start mb-0 mt-3">
        One faraday ({"\\(F = 96485\\)"} C/mol) represents the charge carried by one
        mole of electrons, linking electrical and chemical quantities.
      </p>
    </>
  );
}

export function NernstInfo() {
  return (
    <>
      <p className="text-start mb-1">
        The Nernst equation describes how the cell potential of an electrochemical
        cell varies with the concentrations (activities) of the species involved.
        It extends standard potentials to non-standard conditions.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$E = E^\\circ - \\frac{RT}{nF}\\ln Q$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(E^\\circ\\)"} is the standard potential, {"\\(n\\)"} is electrons transferred, and {"\\(Q\\)"} is the reaction quotient.
      </p>
      <p className="text-start mb-0 mt-3">
        At 25°C, this simplifies to {"\\(E = E^\\circ - \\frac{0.0592}{n}\\log Q\\)"} when
        using base-10 logarithms and expressing potential in volts.
      </p>
    </>
  );
}

export function VanDerWaalsInfo() {
  return (
    <>
      <p className="text-start mb-1">
        The van der Waals equation modifies the ideal gas law to account for the
        finite size of gas molecules and the attractive forces between them. It
        provides a more accurate description of real gas behavior, especially at
        high pressures and low temperatures.
      </p>
      <p className="mt-0">Expressed symbolically,</p>
      <p className="text-center">{"$$\\left(P + \\frac{an^2}{V^2}\\right)(V - nb) = nRT$$"}</p>
      <p className="mt-2 text-center">
        Where {"\\(a\\)"} corrects for intermolecular attraction and {"\\(b\\)"} corrects for molecular volume.
      </p>
      <p className="text-start mb-0 mt-3">
        The constants {"\\(a\\)"} and {"\\(b\\)"} are specific to each gas and are determined
        experimentally. Larger {"\\(a\\)"} values indicate stronger intermolecular forces,
        while larger {"\\(b\\)"} values indicate larger molecular size.
      </p>
    </>
  );
}


