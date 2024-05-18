<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $table = 'indicators';
    protected $fillable = ['name', 'code', 'eng_name', 'image', 'guide', 'short_description', 'description', 'created_at', 'updated_at'];

    static function total($s)
    {
        $r = 0;
        $s = intval($s);
        if ($s < 10 || $s == 11 || $s == 22 || $s == 33) {
            return $s;
        } else {
            foreach (str_split($s) as $char) {
                $r = $r + $char;
            }
            while ($r > 9 && $r != 11 && $r != 22 && $r != 33) {
                $s = $r;
                $r = 0;
                foreach (str_split($s) as $char) {
                    $r = $r + $char;
                }
            }
            return $r;
        }
    }

    static function totalIgnoreMaster($s)
    {
        $r = 0;
        $s = intval($s);

        foreach (str_split($s) as $char) {
            $r = $r + $char;
        }
        while ($r > 9) {
            $s = $r;
            $r = 0;
            foreach (str_split($s) as $char) {
                $r = $r + $char;
            }
        }
        return $r;
    }

    static function textToNumber($s)
    {
        $one    = ['a', 'j', 's', 'A', 'J', 'S'];
        $two    = ['b', 'k', 't', 'B', 'K', 'T'];
        $three  = ['c', 'l', 'u', 'C', 'L', 'U'];
        $four   = ['d', 'm', 'v', 'D', 'M', 'V'];
        $five   = ['e', 'n', 'w', 'E', 'N', 'W'];
        $six    = ['f', 'o', 'x', 'F', 'O', 'X'];
        $seven  = ['g', 'p', 'y', 'G', 'P', 'Y'];
        $eight  = ['h', 'q', 'z', 'H', 'Q', 'Z'];
        $nine   = ['i', 'r', 'I', 'R'];
        $str    = '';
        foreach (str_split($s) as $char) {
            switch ($char) {
                case (in_array($char, $one)):
                    $str .= '1';
                    break;
                case (in_array($char, $two)):
                    $str .= '2';
                    break;
                case (in_array($char, $three)):
                    $str .= '3';
                    break;
                case (in_array($char, $four)):
                    $str .= '4';
                    break;
                case (in_array($char, $five)):
                    $str .= '5';
                    break;
                case (in_array($char, $six)):
                    $str .= '6';
                    break;
                case (in_array($char, $seven)):
                    $str .= '7';
                    break;
                case (in_array($char, $eight)):
                    $str .= '8';
                    break;
                case (in_array($char, $nine)):
                    $str .= '9';
                    break;
            }
        }
        return $str;
    }

    static function convertViToEn($str)
    {
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/",    "a", $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/",                "e", $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/",                            "i", $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/",    "o", $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/",                "u", $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/",                            "y", $str);
        $str = preg_replace("/(đ)/",                                    "d", $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/",    "A", $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/",                "E", $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/",                            "I", $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/",    "O", $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/",                "U", $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/",                            "Y", $str);
        $str = preg_replace("/(Đ)/",                                    "D", $str);
        //$str = str_replace(" ", "-", str_replace("&*#39;","",$str));
        return $str;
    }

    static function getVowelAndConsonant($str)
    {
        $vowels = ['a', 'e', 'i', 'o', 'u', 'y', 'A', 'E', 'I', 'O', 'U', 'Y'];
        $s = [
            'vowel' => '',
            'consonant' => ''
        ];

        /// Nếu chuoi có 1 ký tự và là chữ Y thì xác định là nguyên âm luôn
        if (strlen($str) == 1 && ($str == 'y' || $str == 'Y')) {
            $s['vowel'] .= $str;
            /// ngược lại nếu len > 1 và ko phải Y thì kiểm tra tiếp
        } else {
            foreach (str_split($str) as $index => $c) {
                if (in_array($c, $vowels)) {
                    if ($c == 'y' || $c == 'Y') {
                        if ($index == 0) {
                            $s['consonant'] .= $c;
                        } else {
                            if (!in_array($str[$index - 1], $vowels)) {
                                $s['vowel'] .= $c;
                            } else {
                                $s['consonant'] .= $c;
                            }
                        }
                    } else {
                        $s['vowel'] .= $c;
                    }
                } else {
                    $s['consonant'] .= $c;
                }
            }
        }


        return $s;
    }

    static function getFirstOfWord($str)
    {
        $s = '';
        foreach (explode(' ', trim($str)) as $word) {
            foreach (str_split($word) as  $index => $char)
                if ($index == 0) {
                    $s .= $char;
                }
        }
        return $s;
    }

    public static function LifePathCalc($customer) // đường đời
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);

        $yr = self::total($dateValue->year);
        $mon = self::total($dateValue->month);
        $date = self::total($dateValue->day);

        $life_path = self::total($yr + $mon + $date);

        return $life_path;
    }

    public static function ExpressionCalc($customer) // sứ mệnh
    {
        // dd(self::convertViToEn($customer->last_name));
        $fn = self::total(self::textToNumber(trim(self::convertViToEn($customer->first_name))));
        $ln = explode(' ', trim(self::convertViToEn($customer->last_name))); // array

        $total_ln = 0;
        foreach ($ln as $word) {
            $total_ln = $total_ln + self::total(self::textToNumber($word));
        }
        // dd($fn, $total_ln);
        $total = self::total($fn + $total_ln);
        return $total;
    }

    public static function HeartDesireCalc($customer) // Linh hồn
    {
        $fn = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $vowels = '';
        foreach (explode(' ', $fn) as $w) {
            $vowels .= self::getVowelAndConsonant($w)['vowel'];
        }
        return self::total(self::textToNumber($vowels));
    }
    public static function PersonalityCalc($customer) // Nhân cách
    {
        $fullname = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $consonant = '';
        foreach (explode(' ', $fullname) as $w) {
            $consonant .= self::getVowelAndConsonant($w)['consonant'];
        }

        return self::total(self::textToNumber($consonant));
    }

    public static function BalanceCalc($customer) // Cân bằng
    {
        $fn = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $first_of_word = self::getFirstOfWord($fn);
        return self::total(self::textToNumber($first_of_word));
    }

    public static function BirthdayCalc($customer) // Ngày sinh
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);
        $date = self::total($dateValue->day);
        return self::total($date);
    }

    public static function KarmicLessonsCalc($customer) // Chỉ ssố thiếu
    {
        $fn = self::textToNumber(trim(self::convertViToEn($customer->first_name)));
        $ln = explode(' ', trim(self::convertViToEn($customer->last_name))); // array
        foreach ($ln as $word) {
            $fn .= self::textToNumber($word);
        }
        $kl = [];
        for ($i = 1; $i < 10; $i++) {
            if (!str_contains($fn, $i)) {
                array_push($kl, intval($i));
            }
        }
        return $kl;
    }

    public static function RationalThoughtCalc($customer) // Tư duy lý trí
    {
        $fn = self::total(self::textToNumber(trim(self::convertViToEn($customer->first_name))));

        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);
        $date = self::total($dateValue->day);

        return self::total($fn + $date);
    }

    public static function HiddenPassionCalc($customer) // Đam mê tiềm ẩn
    {
        $fn = self::textToNumber(trim(self::convertViToEn($customer->first_name)));
        $ln = explode(' ', trim(self::convertViToEn($customer->last_name))); // array
        foreach ($ln as $word) {
            $fn .= self::textToNumber($word);
        }
        $values = array_count_values(str_split($fn));
        arsort($values);
        $hp = [];
        $max = 0;
        foreach ($values as $key => $item) {
            // echo $key . ' ' . $item . ' ' . $max . '<br/>';
            if ($item >= $max) {
                array_push($hp, $key);
                $max = $item;
            }
        }
        return $hp;
    }

    public static function ChallengeAndPinnacleCalc($customer) // Thách thức và Chặng
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);

        $r_three = self::totalIgnoreMaster($dateValue->year); // total số năm sinh
        $r_one = self::totalIgnoreMaster($dateValue->month); // total số tháng sinh
        $r_two = self::totalIgnoreMaster($dateValue->day); // total số ngày sinh

        $life_path = self::totalIgnoreMaster($r_three + $r_one + $r_two); // chỉ số đường đời này bỏ qua các số Master

        $c_one = abs($r_one - $r_two);
        $c_two = abs($r_two - $r_three);
        $c_three = abs($c_one - $c_two);
        $c_four = abs($r_three - $r_one);

        $p_one = self::totalIgnoreMaster($r_one + $r_two);
        $p_two = self::totalIgnoreMaster($r_two + $r_three);
        $p_three = self::totalIgnoreMaster($p_one + $p_two);
        // duy nhất chặng cuối có thể có số master
        $p_four = self::total(self::totalIgnoreMaster($dateValue->month) + self::totalIgnoreMaster($dateValue->year));

        $age_one = 36 - $life_path;
        $age_two = $age_one + 9;
        $age_three = $age_two + 9;
        $age_four = $age_three + 9;

        $cp = [
            'root' => [$r_one, $r_two, $r_three],
            'challenge' => [$c_one, $c_two, $c_three, $c_four],
            'pinnacle' => [$p_one, $p_two, $p_three, $p_four],
            'age' => [$age_one, $age_two, $age_three, $age_four]
        ]; // chỉ số Thách thức (challenge) và chỉ số Chặng (pinnacle)

        return $cp;
    }

    public static function YearAndMonthCalc($customer) // Năm cá nhân và tháng cá nhân
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);

        $month = self::total($dateValue->month); // total số tháng sinh
        $date = self::total($dateValue->day); // total số ngày sinh
        $this_year = self::total(Carbon::now()->year);

        $p_yrs_mon = [];
        for ($i = 0; $i < 9; $i++) {
            $y = self::totalIgnoreMaster($date + $month + $this_year + $i);

            $p_yrs_mon[$y] = [];
            for ($j = 0; $j < 12; $j++) {
                array_push($p_yrs_mon[$y], self::totalIgnoreMaster($y + ($j + 1)));
            }
        }

        return $p_yrs_mon;
    }

    // 20240518 Hàm kiểm tra xem có chỉ số Bài Học hay không
    static function check($number)
    {
        $steps = [];

        // Chuyển đổi số nguyên thành mảng các chữ số
        $digits = str_split($number);

        // Lặp lại cho đến khi còn lại 1 chữ số
        while (count($digits) > 1) {
            // Tính tổng các chữ số
            $sum = 0;
            foreach ($digits as $digit) {
                $sum += (int) $digit;
            }

            // Cập nhật mảng các kết quả các bước
            array_push($steps, $sum);

            // Cập nhật mảng các chữ số
            $digits = str_split($sum);
        }

        // Kiểm tra kết quả kế cuối cùng count phần tử của steps, phần tử cuối là n - 1 nên kế cuối là n - 2
        if (count($steps) > 1) {
            if ($steps[count($steps) - 2] == 13 || $steps[count($steps) - 2] == 14 || $steps[count($steps) - 2] == 16 || $steps[count($steps) - 2] == 19) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }




    /* 20240428 - Chỉ số Bài học - Lesson
    * Tính các chỉ số Đường đời, Sứ mệnh, Linh hồn, Nhân cách, Trưởng thành, Ngày sinh
    * Nếu trong các phép tính của chỉ số trên xuất hiện số 13/4, 14/5, 16/7 hay 19/1 
    * (Lưu ý: 13, 14, 16 hay 19 là các số xuất hiện trước khi rút gọn về 1 chữ số)
    **/
    public static function LessonCalc($customer) // 20240428 cập nhật chỉ số Bài Học
    {
        $lesson_arr = [
            'life_path' => false,
            'expression' => false,
            'heart_desire' => false,
            'personality' => false,
            'maturity' => false,
            'birthday' => false,
        ];
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);
        $fullname = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);

        // kiểm tra life_path Done
        if (self::LifePathCalc($customer) == 1 || self::LifePathCalc($customer) == 4 || self::LifePathCalc($customer) == 5 || self::LifePathCalc($customer) == 7) {
            if (self::check(self::total($dateValue->year) . self::total($dateValue->month) . self::total($dateValue->day))) {
                $lesson_arr['life_path'] = true;
            }
        }

        // kiểm tra expression Done
        if (self::ExpressionCalc($customer) == 1 || self::ExpressionCalc($customer) == 4 || self::ExpressionCalc($customer) == 5 || self::ExpressionCalc($customer) == 7) {
            $fn = self::total(self::textToNumber(trim(self::convertViToEn($customer->first_name))));
            $ln = explode(' ', trim(self::convertViToEn($customer->last_name))); // array

            $total_ln = 0;
            foreach ($ln as $word) {
                $total_ln = $total_ln + self::total(self::textToNumber($word));
            }
            if (self::check($fn . $total_ln)) {
                $lesson_arr['expression'] = true;
            }
        }

        // kiểm tra heart_desire
        if (self::HeartDesireCalc($customer) == 1 || self::HeartDesireCalc($customer) == 4 || self::HeartDesireCalc($customer) == 5 || self::HeartDesireCalc($customer) == 7) {
            $vowels = '';
            foreach (explode(' ', $fullname) as $w) {
                $vowels .= self::getVowelAndConsonant($w)['vowel'];
            }
            if (self::check(self::textToNumber($vowels))) {
                $lesson_arr['heart_desire'] = true;
            };
        }

        // kiểm tra personality Done
        if (self::PersonalityCalc($customer) == 1 || self::PersonalityCalc($customer) == 4 || self::PersonalityCalc($customer) == 5 || self::PersonalityCalc($customer) == 7) {
            $consonant = '';
            foreach (explode(' ', $fullname) as $w) {
                $consonant .= self::getVowelAndConsonant($w)['consonant'];
            }

            if (self::check(self::textToNumber($consonant))) {
                $lesson_arr['personality'] = true;
            };
        }

        // kiểm tra maturity Done
        $m = $customer->life_path + $customer->expression;
        if ($m == 13 || $m == 14 || $m == 16 || $m == 19) {
            $lesson_arr['maturity'] = true;
        }

        // kiểm tra birthday Done
        if ($dateValue->day == 13 || $dateValue->day == 14 || $dateValue->day == 16 || $dateValue->day == 19) {
            $lesson_arr['birthday'] = true;
        }

        return $lesson_arr;
    }

    /* 20240428 - Chỉ số Thái độ - Attitude
    * Được tính bằng cách cộng tất cả các chữ số trong ngày sinh và tháng sinh
    * Bước 1: Rút gọn ngày và tháng sinh của bạn thành các số có một chữ số, trừ khi kết quả là 11, 22, 33
    * Bước 2: Cộng các kết quả rút gọn có một chữ số với nhau (và cả 11, 22 hoặc 33 nếu có), nếu kết quả là số có hai chữ số, tiếp tục cộng tất cả các chữ số với nhau cho đến khi đạt kết quả là số có một chữ số từ 1 đến 9.
    **/
    public static function AttitudeCalc($customer)
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);
        $month = self::total($dateValue->month); // total số tháng sinh
        $date = self::total($dateValue->day); // total số ngày sinh


        return self::totalIgnoreMaster($date + $month);
    }

    /* 20240428 - Chỉ số Thế Hệ - Generation
    * Cộng tổng các chữ số trong năm sinh, sau đó rút gọn thành các số có 1 chữ số từ 1-9.
    **/
    public static function GenerationCalc($customer)
    {
        $dateValue = Carbon::createFromFormat('d/m/Y', $customer->dob);
        $year = self::total($dateValue->year); // total số năm sinh

        return self::totalIgnoreMaster($year);
    }

    public static function getIndicatorWithMasterArr()
    {
        return [
            1 => '1',
            2 => '2',
            3 => '3',
            4 => '4',
            5 => '5',
            6 => '6',
            7 => '7',
            8 => '8',
            9 => '9',
            11 => '11',
            22 => '22',
            33 => '33'
        ];
    }
}
