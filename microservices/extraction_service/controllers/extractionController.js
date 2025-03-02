const ExtractionService = require('../services/extractionService');
//user multer to get the file 
class ExtractionController{
    async extractAndSave(req, res){
        try{
            if(!req.file){
                return res.return(400).json({message: 'No file uploaded'});
            }

            const extractedData = await ExtractionService.extractTextFromPdf(req.file);

            const saveData = await ExtractionService.saveExtractedData(extractedData);

            res.status(200).json({
                message: "Pdf parsed successfully",
                data: saveData
            });
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
};

module.exports = new ExtractionController();