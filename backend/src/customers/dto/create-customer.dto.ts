import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString({ message: 'Tên phải là một chuỗi ký tự' })
  first_name: string;

  @IsNotEmpty({ message: 'Họ và chữ lót không được để trống' })
  @IsString({ message: 'Họ và chữ lót phải là một chuỗi ký tự' })
  last_name: string;

  @IsNotEmpty({ message: 'Ngày sinh không được để trống' })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
    message: 'Ngày sinh phải có định dạng DD/MM/YYYY (ví dụ: 15/11/1980)',
  })
  dob: string;
}
