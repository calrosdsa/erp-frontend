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
      return undefined
    }
    }
  }



  export function removeFromList<T>(list: T[], index?: number | number[]): T[] {
    // If index is undefined, return the original list
    if (index === undefined) return list;
  
    // If index is a single number, remove the element at that index
    if (typeof index === 'number') {
      if (index >= 0 && index < list.length) {
        const newList = [...list];
        newList.splice(index, 1); // Remove one element at the given index
        return newList;
      }
      return list; // If index is out of bounds, return the original list
    }
  
    // If index is an array of numbers, remove the elements at those indexes
    if (Array.isArray(index)) {
      // Filter out invalid indexes and sort in descending order (to avoid re-indexing issues)
      const validIndexes = index.filter(i => i >= 0 && i < list.length).sort((a, b) => b - a);
  
      const newList = [...list];
      validIndexes.forEach(i => {
        newList.splice(i, 1); // Remove one element at each valid index
      });
  
      return newList;
    }
  
    return list; // Return the original list if index is invalid
  }