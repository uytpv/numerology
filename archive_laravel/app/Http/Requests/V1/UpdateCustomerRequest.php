<?php

namespace App\Http\Requests\V1;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        if ($this->method == 'PUT') {
            return [
                'first_name' => ['required'],
                'last_name' => ['required'],
                'dob' => ['required']
            ];
        } else {
            return [
                'first_name' => ['sometimes', 'required'],
                'last_name' => ['sometimes', 'required'],
                'dob' => ['sometimes', 'required']
            ];
        }
    }
}
