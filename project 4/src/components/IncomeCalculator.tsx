import { useState, useEffect } from "react";
import { Calculator } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const experienceLevels = [
  { id: "intermedio", label: "Intermedio", hourlyRate: 25 },
  { id: "avanzado", label: "Avanzado", hourlyRate: 50 },
  { id: "experto", label: "Experto", hourlyRate: 75 },
  { id: "pro", label: "Pro", hourlyRate: 100 },
];

const hoursRange = [1, 2, 3, 4, 5, 6, 7, 8];

const IncomeCalculator = () => {
  const [experienceLevel, setExperienceLevel] = useState("intermedio");
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [annualIncome, setAnnualIncome] = useState(0);
  
  const calculateIncome = () => {
    const selectedLevel = experienceLevels.find(level => level.id === experienceLevel);
    const hourlyRate = selectedLevel?.hourlyRate || 25;
    
    const dailyIncome = hourlyRate * hoursPerDay;
    const workdaysPerMonth = 20;
    const monthsPerYear = 12;
    
    const monthly = dailyIncome * workdaysPerMonth;
    const annual = monthly * monthsPerYear;
    
    setMonthlyIncome(monthly);
    setAnnualIncome(annual);
  };
  
  useEffect(() => {
    calculateIncome();
  }, [experienceLevel, hoursPerDay]);
  
  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="p-3 rounded-full bg-purple-500/30 border border-purple-500/40 shadow-lg shadow-purple-500/20">
          <Calculator className="h-8 w-8 text-purple-200" />
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gradient">Calculadora de Ingresos</h3>
      </div>
      
      {/* Calculator Card */}
      <div className="w-full p-6 rounded-2xl bg-calculator-darkblue/80 backdrop-blur-sm border border-purple-500/10">
        {/* Experience Level */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-gray-300">
            <span className="h-6 w-6 rounded-full bg-calculator-primary/30 flex items-center justify-center text-sm">+</span>
            <h4 className="text-sm md:text-base">Nivel de experiencia</h4>
          </div>
          
          <Tabs defaultValue={experienceLevel} onValueChange={setExperienceLevel} className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-calculator-card/50">
              {experienceLevels.map((level) => (
                <TabsTrigger
                  key={level.id}
                  value={level.id}
                  className="data-[state=active]:bg-calculator-primary data-[state=active]:text-white"
                >
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {/* Hours per day */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="h-6 w-6 rounded-full flex items-center justify-center text-sm border border-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </span>
              <h4 className="text-sm md:text-base">Horas por día</h4>
            </div>
            
            <div className="h-12 w-12 flex items-center justify-center bg-blue-500/20 rounded-lg border border-blue-500/20 text-white">
              {hoursPerDay}h
            </div>
          </div>
          
          <div className="px-2 py-6 bg-calculator-card/30 rounded-lg">
            <Slider
              defaultValue={[hoursPerDay]}
              min={1}
              max={8}
              step={1}
              onValueChange={([value]) => setHoursPerDay(value)}
              className="mb-6"
            />
            
            <div className="flex justify-between text-xs text-gray-400">
              {hoursRange.map(hour => (
                <span key={hour}>{hour}h</span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Income Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Monthly Income */}
          <div className="p-6 rounded-lg bg-calculator-card/70 text-center">
            <p className="text-sm text-gray-300 mb-2">Ingresos Mensuales</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-green-400 font-light">$</span>
              <span className="text-4xl font-bold text-white">{monthlyIncome.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">Basado en 20 días laborables</p>
          </div>
          
          {/* Annual Income */}
          <div className="p-6 rounded-lg bg-calculator-card/70 text-center">
            <p className="text-sm text-gray-300 mb-2">Ingresos Anuales</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="text-green-400 font-light">$</span>
              <span className="text-4xl font-bold text-white">{annualIncome.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-500">Basado en 12 meses</p>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-300 mb-4">¿Quieres aprender a crear Agentes IA que te generen estos ingresos?</p>
          <Button className="bg-calculator-primary hover:bg-calculator-secondary text-white px-6 py-6 rounded-md">
            Ver opciones de Coaching VIP
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IncomeCalculator;