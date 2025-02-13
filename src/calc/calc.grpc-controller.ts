import { Controller } from '@nestjs/common';
import {
  CalcServiceController,
  CalcServiceControllerMethods,
  SumReq,
  SumRes,
} from '../proto/interfaces/calc.interface';
import { Observable, ReplaySubject } from 'rxjs';
import { CalcService } from './calc.service';

@Controller('calc')
@CalcServiceControllerMethods()
export class CalcGrpcController implements CalcServiceController {
  constructor(private readonly calcService: CalcService) {}

  sum(request: Observable<SumReq>): Observable<SumRes> {
    const subject = new ReplaySubject<SumRes>(1);

    this.calcService.sum(request, subject);

    return subject.asObservable();
  }
}
