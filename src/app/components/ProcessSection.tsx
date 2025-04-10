import React from 'react';

interface ProcessStep {
  id: number;
  number: string;
  title: string;
  description: string;
  jp: string;
}

const processSteps: ProcessStep[] = [
  {
    id: 1,
    number: "01",
    title: "Discussion",
    description: "We talk about your project, analyze your references, and identify the key sound characteristics you want to achieve.",
    jp: "議論"
  },
  {
    id: 2,
    number: "02",
    title: "Concept",
    description: "We create a sound concept for your project, taking into account all your wishes and our technical expertise.",
    jp: "コンセプト"
  },
  {
    id: 3,
    number: "03",
    title: "Production",
    description: "We work on the implementation of the concept, keeping you updated on the progress and making adjustments as needed.",
    jp: "製作"
  },
  {
    id: 4,
    number: "04",
    title: "Refinement",
    description: "We finalize the sound, focusing on the details to ensure that everything meets our high standards and your expectations.",
    jp: "改良"
  },
  {
    id: 5,
    number: "05",
    title: "Delivery",
    description: "We provide you with the final product in the formats you need, along with any additional materials or explanations.",
    jp: "納品"
  }
];

export default function ProcessSection() {
  return (
    <section className="jp-section py-24 bg-primary dark:bg-gray-900">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="jp-heading text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            <span className="text-accent-custom">プロセス</span> PROCESS
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            How we work with your project step by step
          </p>
        </div>
        
        <div className="space-y-12">
          {processSteps.map((step) => (
            <div key={step.id} className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-full md:w-1/4">
                <div className="flex items-center">
                  <div className="text-5xl font-bold text-accent-custom">{step.number}</div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                    <p className="jp-heading text-accent-custom text-sm">{step.jp}</p>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-3/4 mt-4 md:mt-0">
                <div className="jp-border p-6 bg-background dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 