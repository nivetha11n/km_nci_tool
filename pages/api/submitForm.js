import sql from 'mssql';


const dbConfig = {
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD, // Ensure this is securely handled
 database: process.env.DB_DATABASE,
 server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for Azure SQL
    trustServerCertificate: false, // keep false for production
  },
};

 
async function submitForm(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        createdBy,
        email,
        observationDate,
        category,
        department,
        subDepartment,
        descriptionOfIncident,
        correction,
        correctiveAction,
        linkToReleventDocument,
        directCauseOther, // assuming this is directCause.label if directCause exists
        underlyingCauseOther, // assuming this is underlyingCause.label if underlyingCause exists
        subCategoryDirectCause,
        subCategoryUnderlyingCause
      } = req.body;

      const categoryLabel = category ? category.label : null;
      const departmentLabel = department ? department.label : null;
      const subDepartmentLabel = subDepartment ? subDepartment.label : null;
      const subCategoryDirectCauseLabel = subCategoryDirectCause ? subCategoryDirectCause.label : null;
      const subCategoryUnderlyingCauseLabel = subCategoryUnderlyingCause ? subCategoryUnderlyingCause.label : null;

      await sql.connect(dbConfig);

      const request = new sql.Request();
      request.input('createdBy', sql.NVarChar(255), createdBy);
      request.input('email', sql.NVarChar(255), email);
      request.input('observationDate', sql.Date, new Date(observationDate));
      request.input('category', sql.NVarChar(255), categoryLabel);
      request.input('department', sql.NVarChar(255), departmentLabel);
      request.input('subDepartment', sql.NVarChar(255), subDepartmentLabel);
      request.input('descriptionOfIncident', sql.NVarChar(sql.MAX), descriptionOfIncident);
      request.input('correction', sql.NVarChar(sql.MAX), correction);
      request.input('correctiveAction', sql.NVarChar(sql.MAX), correctiveAction);
      request.input('linkToReleventDocument', sql.NVarChar(sql.MAX), linkToReleventDocument);
      request.input('directCauseOther', sql.NVarChar(255), directCauseOther);
      request.input('underlyingCauseOther', sql.NVarChar(255), underlyingCauseOther);
      request.input('subCategoryDirectCause', sql.NVarChar(255), subCategoryDirectCauseLabel);
      request.input('subCategoryUnderlyingCause', sql.NVarChar(255), subCategoryUnderlyingCauseLabel);

      const result = await request.query(`
        INSERT INTO devnci (
          createdBy,
          email,
          observationDate,
          category,
          department,
          subDepartment,
          descriptionOfIncident,
          correction,
          correctiveAction,
          linkToReleventDocument,
          directCauseOther,
          underlyingCauseOther,
          subCategoryDirectCause,
          subCategoryUnderlyingCause
        ) OUTPUT INSERTED.ID VALUES (
          @createdBy,
          @email,
          @observationDate,
          @category,
          @department,
          @subDepartment,
          @descriptionOfIncident,
          @correction,
          @correctiveAction,
          @linkToReleventDocument,
          @directCauseOther,
          @underlyingCauseOther,
          @subCategoryDirectCause,
          @subCategoryUnderlyingCause
        )
      `);

      const caseNumber = result.recordset[0].ID;

      await sql.close();
      res.status(200).json({ message: 'Form submitted successfully', caseNumber: caseNumber, data: result.recordset });
    } catch (err) {
      console.error('SQL error', err);
      res.status(500).json({ message: 'Error submitting form', error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default submitForm;