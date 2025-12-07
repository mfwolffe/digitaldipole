/**
 * Unit Converter Page
 *
 * Standalone page for converting between units.
 */
import React from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../components/ui';
import { UnitConverter } from '../components/UnitConverter';

export function ConverterPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Unit Converter</CardTitle>
        </CardHeader>
        <CardBody>
          <UnitConverter fullWidth />
        </CardBody>
      </Card>
    </div>
  );
}

export default ConverterPage;
