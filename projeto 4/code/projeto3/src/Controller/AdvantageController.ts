import { Advantage } from '../entity/Advantage';
import { AppDataSource } from '../data-source';
import { Request, Response } from 'express';
import { AdvantageService } from '../Services/AdvantageServices';
import { AdvantageRepository } from '../repositories/AdvantageRepository';
import multer from 'multer';

// Interface para estender o Request com o arquivo do Multer
interface MulterRequest extends Request {
	file?: multer.File;
}

export class AdvantageController {
	private advantageService: AdvantageService;

	constructor() {
		this.advantageService = new AdvantageService();
	}

	async create(request: MulterRequest, response: Response) {
		try {
			if (!request.file) {
				return response.status(400).json({ error: 'Image is required' });
			}

			const advantageData = {
				...request.body,
				image: request.file.buffer,
				coins: parseFloat(request.body.coins),
			};

			const advantage = await this.advantageService.create(advantageData);
			return response.status(201).json(advantage);
		} catch (error) {
			return response.status(400).json({ error: error.message });
		}
	}

	async listAllAdvantages(request: Request, response: Response) {
		try {
			const advantages = await this.advantageService.listAllAdvantages();
			return response.json(advantages);
		} catch (error) {
			return response.status(400).json({ error: error.message });
		}
	}

	async listAdvantagesByEnterprise(request: Request, response: Response) {
		try {
			const enterpriseId = parseInt(request.params.enterpriseId);

			if (isNaN(enterpriseId)) {
				return response.status(400).json({ error: 'Invalid enterprise ID' });
			}

			const advantages = await this.advantageService.listAdvantagesByEnterprise(enterpriseId);
			return response.json(advantages);
		} catch (error) {
			return response.status(404).json({ error: error.message });
		}
	}

	async listAllAdvantagesForStudent(request: Request, response: Response) {
		try {
			const institutionId = parseInt(request.params.institutionId);
			const advantages = await this.advantageService.listAllAdvantagesForStudent(institutionId);
			return response.json(advantages);
		} catch (error) {
			return response.status(400).json({ error: error.message });
		}
	}
}
