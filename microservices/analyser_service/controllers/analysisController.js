const AnalysisService = require('../services/analysisService');

class AnalysisController{
    async getAnalysis(req, res){
        try{
            const {customerId} = req.params;
            if(!customerId){
                return res.status(400).json({message: 'Customer ID is required'});
            }
            const stats = await AnalysisService.analysisService(customerId);
            return res.status(200).json(stats);
        }catch (error){
            console.error('Error getting the analysis', error.message);
            res.status(500).json({message: 'Error getting the analysis'});
        }
    }
};

module.exports = new AnalysisController();

