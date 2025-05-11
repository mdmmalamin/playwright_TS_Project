// import { FullConfig, FullResult, Reporter, Suite, TestCase, TestStep } from "@playwright/test/reporter";
// import { TestResult } from "allure-js-commons";

// export default  class LamdaReporter implements Reporter {


//   constructor() {

//   }

//   onEnd(result: FullResult): Promise<{ status?: FullResult['status'] }>  {
//     // return new Promise((resolve) => {
//     //   console.log("All tests have completed.");
//     //   resolve({ status: result.status });
//     // });

//   console.log("first")

//   };
  
//     onBegin(config: FullConfig, suite: Suite): void{

//     };
  
    
//     // onError(error: TestError): void{};
  
    
//     // // onExit(): Promise<void>{};
  
    
//     // onStdErr(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void{
      
//     // };
  
   
//     // onStdOut(chunk: string|Buffer, test: void|TestCase, result: void|TestResult): void;
  
    
//     // onStepBegin(test: TestCase, result: TestResult, step: TestStep): void;
  
    
//     // onStepEnd(test: TestCase, result: TestResult, step: TestStep): void;
  
    
//     // onTestBegin(test: TestCase, result: TestResult): void;
  
    
//     // onTestEnd(test: TestCase, result: TestResult): void;
  
    
//     // printsToStdio(): boolean;
// }