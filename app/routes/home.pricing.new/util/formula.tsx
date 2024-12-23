interface FormulaCalculator<T extends Record<string, any>> {
    calculate: (formula:string,values: T) => number | undefined;
  }
  
 export class FormulaEngine<T extends Record<string, any>> implements FormulaCalculator<T> {
    // private formula: string;
  
    // constructor(formula: string) {
    //   this.formula = formula;
    // }
  
    // The 'calculate' function that can dynamically calculate based on the formula string and provided values
    calculate(formula:string,values: T): number | undefined {
      try{

        //   let formulaWithValues = this.formula;
        
        // Replace all the variable names with values from the provided object
        for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
          formula = formula.replace(new RegExp(`\\b${key}\\b`, 'g'), values[key].toString());
        }
      }
      
      // Evaluate the formula (in this case, using eval)
      return Math.ceil(eval(formula)*100)/100;
    }catch(err){
      return 0
    }
    }
  }