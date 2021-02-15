<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Indicator extends Model
{
    protected $table = 'indicators';
    protected $fillable = ['name', 'code', 'eng_name', 'guide', 'short_description', 'description', 'created_at', 'updated_at'];

    static function total($s)
    {
        $r = 0;
        $s = intval($s);

        if ($s < 9 || $s == 11 || $s == 22 || $s == 33) {
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
        $one = ['a', 'j', 's', 'A', 'J', 'S'];
        $two = ['b', 'k', 't', 'B', 'K', 'T'];
        $three = ['c', 'l', 'u', 'C', 'L', 'U'];
        $four = ['d', 'm', 'v', 'D', 'M', 'V'];
        $five = ['e', 'n', 'w', 'E', 'N', 'W'];
        $six = ['f', 'o', 'x', 'F', 'O', 'X'];
        $seven = ['g', 'p', 'y', 'G', 'P', 'Y'];
        $eight = ['h', 'q', 'z', 'H', 'Q', 'Z'];
        $nine = ['i', 'r', 'I', 'R'];
        $str = '';
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
        $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/", "a", $str);
        $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/", "e", $str);
        $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/", "i", $str);
        $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/", "o", $str);
        $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/", "u", $str);
        $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/", "y", $str);
        $str = preg_replace("/(đ)/", "d", $str);
        $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/", "A", $str);
        $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/", "E", $str);
        $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/", "I", $str);
        $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/", "O", $str);
        $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/", "U", $str);
        $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/", "Y", $str);
        $str = preg_replace("/(Đ)/", "D", $str);
        //$str = str_replace(" ", "-", str_replace("&*#39;","",$str));
        return $str;
    }

    static function getVowelAndConsonant($str)
    {
        $vowels = ['a', 'e', 'i', 'j', 'o', 'u', 'y', 'A', 'E', 'I', 'J', 'O', 'U', 'Y'];
        $s = [
            'vowel' => '',
            'consonant' => ''
        ];
        foreach (str_split($str) as $index => $c) {
            if (in_array($c, $vowels)) {
                if ($c == 'y' || $c == 'Y') {
                    if ($index == 0) {
                        $s['vowel'] .= $c;
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

    public static function LifePathCalc($customer)
    {
        $dateValue = strtotime($customer->dob);

        $yr = self::total(date('Y', $dateValue));
        $mon = self::total(date('m', $dateValue));
        $date = self::total(date('d', $dateValue));

        $life_path = self::total($yr + $mon + $date);
        return $life_path;
    }

    public static function ExpressionCalc($customer)
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

    public static function HeartDesireCalc($customer)
    {
        $fn = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $vowels = self::getVowelAndConsonant($fn)['vowel'];
        return self::total(self::textToNumber($vowels));
    }
    public static function PersonalityCalc($customer)
    {
        $fn = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $consonant = self::getVowelAndConsonant($fn)['consonant'];
        return self::total(self::textToNumber($consonant));
    }

    public static function BalanceCalc($customer)
    {
        $fn = self::convertViToEn($customer->last_name) . ' ' . self::convertViToEn($customer->first_name);
        $first_of_word = self::getFirstOfWord($fn);
        return self::total(self::textToNumber($first_of_word));
    }

    public static function BirthdayCalc($customer)
    {
        $dateValue = strtotime($customer->dob);
        $date = self::total(date('d', $dateValue));
        return self::total($date);
    }

    public static function KarmicLessonsCalc($customer)
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

    public static function RationalThoughtCalc($customer)
    {
        $fn = self::total(self::textToNumber(trim(self::convertViToEn($customer->first_name))));

        $dateValue = strtotime($customer->dob);
        $date = self::total(date('d', $dateValue));

        return self::total($fn + $date);
    }

    public static function HiddenPassionCalc($customer)
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

    public static function ChallengeAndPinnacleCalc($customer)
    {
        $dateValue = strtotime($customer->dob);

        $r_three = self::total(date('Y', $dateValue)); // total số năm sinh
        $r_one = self::total(date('m', $dateValue)); // total số tháng sinh
        $r_two = self::total(date('d', $dateValue)); // total số ngày sinh

        $life_path = self::totalIgnoreMaster($r_three + $r_one + $r_two); // chỉ số đường đời này bỏ qua các số Master

        $c_one = abs($r_one - $r_two);
        $c_two = abs($r_two - $r_three);
        $c_three = abs($c_one - $c_two);
        $c_four = abs($r_three - $r_one);

        $p_one = self::totalIgnoreMaster($r_one + $r_two);
        $p_two = self::totalIgnoreMaster($r_two + $r_three);
        $p_three = self::totalIgnoreMaster($p_one + $p_two);
        // duy nhất chặng cuối có thể có số 11
        $p_four = self::total(self::totalIgnoreMaster(date('m', $dateValue)) + self::totalIgnoreMaster(date('Y', $dateValue)));

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

    public static function YearAndMonthCalc($customer)
    {
        $dateValue = strtotime($customer->dob);

        $month = self::total(date('m', $dateValue)); // total số tháng sinh
        $date = self::total(date('d', $dateValue)); // total số ngày sinh
        $this_year = self::total(date('Y'));

        $p_yrs_mon = [];
        for ($i = -1; $i < 9; $i++) {
            $y = self::totalIgnoreMaster($date + $month + $this_year + $i);

            $p_yrs_mon[$y] = [];
            for ($j = 0; $j < 12; $j++) {
                array_push($p_yrs_mon[$y], self::totalIgnoreMaster($y + ($j + 1)));
            }
        }
        return $p_yrs_mon;
    }
}
