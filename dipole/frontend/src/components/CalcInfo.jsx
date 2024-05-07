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
          <dt>Specific Heat Capacity, {"\\(\\hspace{1mm} c_{sp}\\)"}</dt>
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


