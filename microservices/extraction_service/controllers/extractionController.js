const ExtractionService = require('../services/extractionService');

class ExtractionController{
    async extractAndSave(req, res){
        try{
            if(!req.file){
                return res.status(400).json({message: 'No file uploaded'});
            }

            const extractedText = await ExtractionService.extractTextFromPdf(req.file);
            const parsedData = await ExtractionService.parseDataWithGemini(extractedText);
            const savedFilePath = await ExtractionService.saveExtractedData(parsedData);

            res.status(200).json({
                message: "PDF parsed successfully",
                filePath: savedFilePath,
                data: parsedData
            });
        }catch(err){
            res.status(500).json({message: err.message});
        }
    }
};

module.exports = new ExtractionController();