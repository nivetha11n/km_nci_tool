'use client';

import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Modal from 'react-modal';

// Add this function to decode the base64 token
const decodeToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const Form = () => {
  const [formData, setFormData] = useState({
    createdBy: '',
    email: '',
    observationDate: new Date().toISOString().split('T')[0],
    category: null,
    department: null,
    subDepartment: null,
    shortDescription: '', 
    descriptionOfIncident: '',
    directCause: null,
    underlyingCause: null,
    correction: '',
    correctiveAction: '',
    linkToReleventDocument: '',
    categoryOther: '', 
    directCauseOther: '',
    underlyingCauseOther: '',
  });

  const [charCount, setCharCount] = useState(100);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});


// Use effect to fetch user info and autofill name and email
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Check if running locally (localhost or development mode)
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        // Mock user data for local development
        setFormData((prevFormData) => ({
          ...prevFormData,
          createdBy: 'Local Developer',
          email: 'nna@kitemill.com',
        }));
      } else {
        // Running on production (Azure App Service)
        try {
          const response = await fetch('/.auth/me');
          const userInfo = await response.json();
  
          if (userInfo && userInfo[0]) {
            const decodedToken = decodeToken(userInfo[0].id_token);
            const userName = decodedToken.name;
            const userEmail = decodedToken.email || decodedToken.preferred_username;
  
            setFormData((prevFormData) => ({
              ...prevFormData,
              createdBy: userName,
              email: userEmail,
            }));
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
  
    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      if (document.getElementById('__next')) {
        Modal.setAppElement('#__next');
      } else {
        const interval = setInterval(() => {
          if (document.getElementById('__next')) {
            Modal.setAppElement('#__next');
            clearInterval(interval);
          }
        }, 100);
      }
    }
  }, []);
  

  const optionsCategory = [
    { value: 'hseIncident', label: 'HSE Incident' },
    { value: 'qualityNonConformity', label: 'Quality Non Conformity' },
    { value: 'areasOfImprovements', label: 'Areas of Improvement' },
  ];

  const subCategoryDirectCauseOptions = {
    hseIncident: [
      { value: 'fireOrExplosion', label: 'Fire or Explosion' },
      { value: 'chemicalSpillOrLeak', label: 'Chemical Spill or Leak' },
      { value: 'otherHazardousMaterial', label: 'Other Hazardous Material' },
      { value: 'slipTripOrFall', label: 'Slip, Trip or Fall' },
      { value: 'poorManualHandling', label: 'Poor Manual Handling' },
      { value: 'inadequatePPE', label: 'Inadequate PPE' },
      { value: 'unsafeWorkPractice', label: 'Unsafe Work Practice' },
      { value: 'unsafeEquipment', label: 'Unsafe Equipment' },
      { value: 'electricalHazard', label: 'Electrical Hazard' },
      { value: 'poorHousekeeping', label: 'Poor Housekeeping' },
      { value: 'others', label: 'Others' },
    ],
    qualityNonConformity: [
      { value: 'equipmentFailure', label: 'Equipment Failure' },
      { value: 'materialDefect', label: 'Material Defect' },
      { value: 'designFlaw', label: 'Design Flaw' },
      { value: 'wrongItemSupplied', label: 'Wrong Item Supplied' },
      { value: 'incorrectAssembly', label: 'Incorrect Assembly' },
      { value: 'contamination', label: 'Contamination' },
      { value: 'nonCompliantItem', label: 'Non-Compliant Item' },
      { value: 'wrongLabellingPackaging', label: 'Wrong Labelling / Packaging' },
      { value: 'lackofControl', label: 'Lack of Control' },
      { value: 'deviationFromPlan', label: 'Deviation from Plan' },
      { value: 'others', label: 'Others' },
    ],
    areasOfImprovements: [
      { value: 'inefficientProcess', label: 'Inefficient Process' },
      { value: 'poorCommunication', label: 'Poor Communication' },
      { value: 'customerFeedback', label: 'Customer Feedback' },
      { value: 'equipmentDeterioration', label: 'Equipment Deterioration' },
      { value: 'betterEmployeeHealth', label: 'Better Employee Health' },
      { value: 'safetyImprovement', label: 'Safety Improvement' },
      { value: 'betterQuality', label: 'Better Quality' },
      { value: 'moreSustainable', label: 'More Sustainable' },
      { value: 'lackOfAwarenessTraining', label: 'Lack of Awareness/Training' },
      { value: 'documentation', label: 'Documentation' },
      { value: 'strategicDirection', label: 'Strategic Direction' },
      { value: 'others', label: 'Others' },
    ],
    other: [{ value: 'other', label: 'Other' }],
  };

  const subCategoryUnderlyingCauseOptions = {
    hseIncident: [
      { value: 'lackOfAwarenesTraining', label: 'Lack of Awareness/Training' },
      { value: 'fatigue', label: 'Fatigue' },
      { value: 'inadequatePoliciesProcedures', label: 'Inadequate Policies/Procedures' },
      { value: 'inadequateRiskAssessment', label: 'Inadequate Risk Assessment' },
      { value: 'failureToFollowProcedures', label: 'Failure to Follow Procedures' },
      { value: 'inadequateMaintenance', label: 'Inadequate Maintenance' },
      { value: 'poorSafetyCulture', label: 'Poor Safety Culture' },
      { value: 'insufficientSupervision', label: 'Insufficient Supervision' },
      { value: 'complacency', label: 'Complacency' },
      { value: 'hazardNotCommunicated', label: 'Hazard not Communicated' },
      { value: 'lackOfCommunication', label: 'Lack of Communication' },
      { value: 'externalFactorWeather', label: 'External Factor e.g. weather' },
      { value: 'resourceConstrained', label: 'Resource Constrained' },
      { value: 'inadequateInspectionChecks', label: 'Inadequate Inspection/Checks' },
      { value: 'humanError', label: 'Human Error' },
      { value: 'timePressure', label: 'Time Pressure' },
      { value: 'others', label: 'Others' },
    ],
    qualityNonConformity: [
      { value: 'designFlaws', label: 'Design Flaws' },
      { value: 'inadequateQualityControl', label: 'Inadequate Quality Control' },
      { value: 'supplierIssues', label: 'Supplier Issues' },
      { value: 'lackOfDocumentation', label: 'Lack of Documentation' },
      { value: 'inadequateMaterials', label: 'Inadequate Materials' },
      { value: 'inadequateTesting', label: 'Inadequate Testing' },
      { value: 'inadequateInspection/Checks', label: 'Inadequate Inspection/Checks' },
      { value: 'lackOfAwarenessTraining', label: 'Lack of Awareness/Training' },
      { value: 'temperature', label: 'Temperature' },
      { value: 'calibration', label: 'Calibration' },
      { value: 'poorChangeManagement', label: 'Poor Change Management' },
      { value: 'lackOfCommunication', label: 'Lack of Communication' },
      { value: 'regulatoryChange', label: 'Regulatory Change' },
      { value: 'humanError', label: 'Human Error' },
      { value: 'timePressure', label: 'Time Pressure' },
      { value: 'others', label: 'Others' },
    ],
    areasOfImprovements: [
      { value: 'lackOfProcessOptimisation', label: 'Lack of Process Optimisation' },
      { value: 'ineffectiveCommunication', label: 'Ineffective Communication' },
      { value: 'gapInCompetency', label: 'Gap in Competency' },
      { value: 'resourcingIssues', label: 'Resourcing Issues' },
      { value: 'lackOfCollaboration', label: 'Lack of Collaboration' },
      { value: 'agingToolsTechnology', label: 'Aging Tools/Technology' },
      { value: 'lackOfSupport', label: 'Lack of Support' },
      { value: 'negativeTrending', label: 'Negative Trending' },
      { value: 'marketResearchInsights', label: 'Market Research Insights' },
      { value: 'environmentalImpactAssessment', label: 'Environmental Impact Assessment' },
      { value: 'inadequateSystems ', label: 'Inadequate Systems ' },
      { value: 'inadequateDocumentation', label: 'Inadequate Documentation' },
      { value: 'processUnclear', label: 'Process Unclear' },
      { value: 'inefficiencies', label: 'Inefficiencies' },
      { value: 'failureToLearnFromMistakes', label: 'Failure to Learn from Mistakes' },
      { value: 'others', label: 'Others' },
    ],
    other: [{ value: 'other', label: 'Other' }],
  };

  const optionsDepartment = [
    { value: 'randd', label: 'R&D' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'flightOperations', label: 'Flight Operations' },
    { value: 'administration', label: 'Administration' },
  ];

  const departmentSubOptions = {
    randd: [
      { value: 'kitePowerSupplyandWiring', label: 'Kite power supply and wiring' },
      { value: 'vtolSystem', label: 'VTOL system' },
    ],
    manufacturing: [
      { value: 'productServices', label: 'Product/Services' },
      { value: 'externalSupplier', label: 'External supplier' },
      { value: 'qualityAssurance', label: 'Quality Assurance' },
      { value: 'productionO&M', label: 'Production/O&M' },
    ],
    flightOperations: [
      { value: 'preparationTransportCleanup', label: 'Preparation/Transport/Cleanup' },
      { value: 'unsecureScrewsBolts', label: 'Unsecure screws/Bolts' },
      { value: 'unsuccessfulAutoland', label: 'Unsuccessful Autoland' },
      { value: 'unwantedTetherRelease', label: 'Unwanted tether releases' },
    ],
    administration: [
      { value: 'hse', label: 'HSE' },
      { value: 'it', label: 'IT' },
      { value: 'purchase', label: 'Purchase' },
    ],
  };

  const handleCategorySelectChange = (selectedOption) => {
    if (selectedOption.value === 'other') {
      setFormData({
        ...formData,
        category: selectedOption,
        subCategoryDirectCause: { value: 'others', label: 'Others' },
        directCauseOther: '',
        subCategoryUnderlyingCause: { value: 'others', label: 'Others' },
        underlyingCauseOther: '',
      });
    } else {
      setFormData({
        ...formData,
        category: selectedOption,
        subCategoryDirectCause: null,
        directCauseOther: '',
        subCategoryUnderlyingCause: null,
        underlyingCauseOther: '',
      });
    }
  };

  const handleCategoryOtherChange = (e) => {
    setFormData({
      ...formData,
      categoryOther: e.target.value,
    });
  };

  const handleSubCategoryDirectCause = (selectedOption) => {
    setFormData({
      ...formData,
      subCategoryDirectCause: selectedOption,
    });
  };

  const handleSubCategoryUnderlyingCause = (selectedOption) => {
    setFormData({
      ...formData,
      subCategoryUnderlyingCause: selectedOption,
    });
  };

  const handleDirectCauseOtherChange = (e) => {
    setFormData({
      ...formData,
      directCauseOther: e.target.value,
    });
  };
  
  const handleUnderlyingCauseOtherChange = (e) => {
    setFormData({
      ...formData,
      underlyingCauseOther: e.target.value,
    });
  };

  const handleDepartmentChange = (selectedOption) => {
    setFormData({
      ...formData,
      department: selectedOption,
      subSelection: null, 
    });
  };

  const handleSubDepartmentChange = (selectedOption) => {
    setFormData({
      ...formData,
      subDepartment: selectedOption,
    });
  };

  const handleShortDescriptionChange = (e) => {
    const value = e.target.value;

    // Only update if character count is within limit
    if (value.length <= 100) {
      setFormData({
        ...formData,
        shortDescription: value,
      });
      setCharCount(100 - value.length); // Update the character count
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.createdBy) newErrors.createdBy = 'Created By is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.shortDescription) newErrors.shortDescription = 'Short description is required';
    if (!formData.descriptionOfIncident) newErrors.descriptionOfIncident = 'Description of incident is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

        // Validate form before submission
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors); // Set errors if any fields are invalid
          return; // Stop form submission
        }

    setIsLoading(true);
    try {
      const res = await fetch('/api/submitForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const result = await res.json(); // Only parse as JSON if response is OK
      console.log('Submission Result:', result);

      if (result.caseNumber) {
        setSubmissionMessage(`Submission successful! Your case number is: ${result.caseNumber}`);
      } else {
        setSubmissionMessage('Submission successful, but case number is not available.');
      }
      setModalIsOpen(true); // Open the modal

    } catch (error) {
      console.error('Error during form submission:', error);
      setSubmissionMessage('There was an error submitting the form. Please try again.');
      setModalIsOpen(true);
    }finally {
      setIsLoading(false); // Stop loading state
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      border: 'none', 
      boxShadow: 'none' 
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '300px', // Increase max height of the dropdown
    }),
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '300px', // Set the width of the modal
      padding: '20px', // Add some padding
      borderRadius: '8px', // Optional: rounded corners
      textAlign: 'center', // Center align text
      color: 'green' // Change the text color to green
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)' // Add semi-transparent background
    }
  };
  
  

  return (
    <>
    {isLoading && ( // Show loading spinner when isLoading is true
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-90 z-50">
          <div className="text-white text-lg font-semibold">Submitting...</div>
        </div>
      )}

      <form name="nciForm" onSubmit={handleSubmit} className="max-w-3xl mx-auto p-5 space-y-4 bg-white shadow-lg rounded px-8 pt-8 pb-8 mb-4">
        <h1 className="block text-gray-500 text-2xl font-bold mb-5 text-center font-sans">Non-Conformity & Incident Form</h1>
        <div>
          <label htmlFor="createdBy" className="block text-gray-700 text-sm font-bold mb-2">Created By:</label>
          <input
            type="text"
            id="createdBy"
            name="createdBy"
            value={formData.createdBy}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.createdBy && <p className="text-red-500 text-xs italic">{errors.createdBy}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
           {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="observationDate" className="block text-gray-700 text-sm font-bold mb-2">Date of Observation:</label>
          <input
            type="date"
            id="observationDate"
            name="observationDate"
            value={formData.observationDate}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleCategorySelectChange}
            options={optionsCategory}
            styles={customStyles}
            className="shadow appearance-none border rounded w-full py-0 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {formData.category && formData.category.value === 'other' && (
            <div className="mt-3">
              <label htmlFor="categoryOther" className="block text-gray-700 text-sm font-bold mb-2">Specify Other Category:</label>
              <input
                type="text"
                id="categoryOther"
                name="categoryOther"
                value={formData.categoryOther}
                onChange={handleCategoryOtherChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Please specify"
              />
            </div>
          )}
        </div>
        {formData.category && (
          <div>
            <label htmlFor="subCategoryDirectCause" className="block text-gray-700 text-sm font-bold mb-2">Direct Cause:</label>
            <Select
              id="subCategoryDirectCause"
              name="subCategoryDirectCause"
              value={formData.subCategoryDirectCause}
              onChange={handleSubCategoryDirectCause}
              options={subCategoryDirectCauseOptions[formData.category.value]}
              styles={customStyles}
              className="shadow appearance-none border rounded w-full py-0 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        {formData.subCategoryDirectCause && formData.subCategoryDirectCause.value === 'others' && (
          <div>
            <label htmlFor="directCauseOther" className="block text-gray-700 text-sm font-bold mb-2">Specify Other Direct Cause:</label>
            <input
              type="text"
              id="directCauseOther"
              name="directCauseOther"
              value={formData.directCauseOther}
              onChange={handleDirectCauseOtherChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Please specify"
            />
          </div>
        )}
        {formData.category && (
          <div>
            <label htmlFor="subCategoryUnderlyingCause" className="block text-gray-700 text-sm font-bold mb-2">Underlying Cause:</label>
            <Select
              id="subCategoryUnderlyingCause"
              name="subCategoryUnderlyingCause"
              value={formData.subCategoryUnderlyingCause}
              onChange={handleSubCategoryUnderlyingCause}
              options={subCategoryUnderlyingCauseOptions[formData.category.value]}
              styles={customStyles}
              className="shadow appearance-none border rounded w-full py-0 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        {formData.subCategoryUnderlyingCause && formData.subCategoryUnderlyingCause.value === 'others' && (
          <div>
            <label htmlFor="underlyingCauseOther" className="block text-gray-700 text-sm font-bold mb-2">Specify Other Underlying Cause:</label>
            <input
              type="text"
              id="underlyingCauseOther"
              name="underlyingCauseOther"
              value={formData.underlyingCauseOther}
              onChange={handleUnderlyingCauseOtherChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Please specify"
            />
          </div>
        )}
        <div>
          <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
          <Select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            options={optionsDepartment}
            styles={customStyles}
            className="shadow appearance-none border rounded w-full py-0 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        {formData.department && (
          <div>
            <label htmlFor="subDepartment" className="block text-gray-700 text-sm font-bold mb-2">Sub-Department:</label>
            <Select
              id="subDepartment"
              name="subDepartment"
              value={formData.subDepartment}
              onChange={handleSubDepartmentChange}
              options={departmentSubOptions[formData.department.value]}
              styles={customStyles}
              className="shadow appearance-none border rounded w-full py-0 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div>
          <label htmlFor="shortDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Descriptive Title:
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleShortDescriptionChange}
            maxLength={100} // Limit the characters to 100
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <p className="text-sm text-gray-600">{charCount} characters remaining</p>
          {errors.shortDescription && <p className="text-red-500 text-xs italic">{errors.shortDescription}</p>}
        </div>
        <div>
          <label htmlFor="descriptionOfIncident" className="block text-gray-700 text-sm font-bold mb-2">Description of Incident:</label>
          <textarea
            id="descriptionOfIncident"
            name="descriptionOfIncident"
            value={formData.descriptionOfIncident}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.descriptionOfIncident && <p className="text-red-500 text-xs italic">{errors.descriptionOfIncident}</p>}
          </div>
        <div>
          <label htmlFor="correction" className="block text-gray-700 text-sm font-bold mb-2">Correction:</label>
          <textarea
            id="correction"
            name="correction"
            placeholder='Immediate action taken to correct the situation i.e. how to make situation safe or fix the problem to prevent further negative consequences.'
            value={formData.correction}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="correctiveAction" className="block text-gray-700 text-sm font-bold mb-2">Corrective Action:</label>
          <textarea
            id="correctiveAction"
            name="correctiveAction"
            placeholder='Proposed solution to prevent the situation from happening again i.e. will typically address issues that led up to the situation.'
            value={formData.correctiveAction}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="linkToReleventDocument" className="block text-gray-700 text-sm font-bold mb-2">Link to relevant document:</label>
          <input
            type="text"
            id="linkToReleventDocument"
            name="linkToReleventDocument"
            value={formData.linkToReleventDocument}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>

      {/* Modal for displaying the submission message */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={modalStyles}
        contentLabel="Submission Result"
      >
        <div>
        <p className="mb-4">
            <strong>{submissionMessage}</strong>
          </p>
          <button onClick={closeModal} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Close
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Form;
