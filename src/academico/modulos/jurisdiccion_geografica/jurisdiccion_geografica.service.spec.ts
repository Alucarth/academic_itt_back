import { Test, TestingModule } from '@nestjs/testing';
import { JurisdiccionGeograficaService } from './jurisdiccion_geografica.service';

describe('JurisdiccionGeograficaService', () => {
  let service: JurisdiccionGeograficaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JurisdiccionGeograficaService],
    }).compile();

    service = module.get<JurisdiccionGeograficaService>(JurisdiccionGeograficaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
