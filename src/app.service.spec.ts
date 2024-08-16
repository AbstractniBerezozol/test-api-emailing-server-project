import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailDto } from './emailDto';

describe('AppService', () => {
  let service: AppService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should send email with correct details', async () => {
    const emailDto: EmailDto = {
      from: 'sender@email.com',
      to: 'reciever@email.com',
      subject: 'Testing',
      text: 'BlaBlaBla',
    };

    const sendMailSpy = jest
      .spyOn(mailerService, 'sendMail')
      .mockResolvedValueOnce(null);

    await service.sendLetter(emailDto);

    expect(sendMailSpy).toHaveBeenCalledWith({
      from: emailDto.from,
      to: emailDto.to,
      subject: emailDto.subject,
      text: emailDto.text,
    });

    expect(sendMailSpy).toHaveBeenCalledTimes(1);
  });
});
