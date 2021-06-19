<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $phone
 * @property string $email
 * @property string $dob
 * @property string $created_at
 * @property string $updated_at
 */
class Customer extends Model
{
    protected $table = 'customers';
    protected $fillable = [
        'fist_name', 'last_name', 'phone', 'email', 'dob', 'map', 'admin_id', 'note', 'created_at', 'updated_at',
        'life_path',
        'expression',
        'lpe_bridge',
        'heart_desire',
        'personality',
        'hdp_bridge',
        'balance',
        'birthday',
        'maturity',
        'karmic_lessons',
        'rational_thought',
        'subconscious_confidence',
        'hidden_passion',
        'challennge',
        'pinnacle',
        'age',
        'root',
        'year'
    ];

    public static function calculateIndicators($customer){
        $customer->life_path = Indicator::LifePathCalc($customer);
        $customer->expression = Indicator::ExpressionCalc($customer);
        $customer->lpe_bridge = abs(Indicator::totalIgnoreMaster($customer->life_path) - Indicator::totalIgnoreMaster($customer->expression));
        $customer->heart_desire = Indicator::HeartDesireCalc($customer);
        $customer->personality = Indicator::PersonalityCalc($customer);
        $customer->hdp_bridge = abs(Indicator::totalIgnoreMaster($customer->heart_desire) - Indicator::totalIgnoreMaster($customer->personality));
        $customer->balance = Indicator::BalanceCalc($customer);
        $customer->birthday = Indicator::BirthdayCalc($customer);
        $customer->maturity = Indicator::total($customer->life_path + $customer->expression);
        $customer->karmic_lessons = json_encode(Indicator::KarmicLessonsCalc($customer));
        $customer->rational_thought = Indicator::RationalThoughtCalc($customer);
        $customer->subconscious_confidence = 9 - sizeof(json_decode($customer->karmic_lessons));
        $customer->hidden_passion = json_encode(Indicator::HiddenPassionCalc($customer));
        $customer->challennge = json_encode(Indicator::ChallengeAndPinnacleCalc($customer)['challenge']);
        $customer->pinnacle = json_encode(Indicator::ChallengeAndPinnacleCalc($customer)['pinnacle']);
        $customer->age = json_encode(Indicator::ChallengeAndPinnacleCalc($customer)['age']);
        $customer->root = json_encode(Indicator::ChallengeAndPinnacleCalc($customer)['root']);
        $customer->year = json_encode(Indicator::YearAndMonthCalc($customer));
        $customer->map = json_encode(Customer::calculateMap($customer));
        return $customer;
    }


    public static function calculateMap($customer)
    {
        $map = [];

        array_push($map, [
            'indicator' => 'life_path',
            'number' => Indicator::LifePathCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'expression',
            'number' => Indicator::ExpressionCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'lpe_bridge',
            'number' => abs(Indicator::totalIgnoreMaster(Indicator::LifePathCalc($customer)) - Indicator::totalIgnoreMaster(Indicator::ExpressionCalc($customer)))
        ]);
        array_push($map, [
            'indicator' => 'heart_desire',
            'number' => Indicator::HeartDesireCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'personality',
            'number' => Indicator::PersonalityCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'hdp_bridge',
            'number' => abs(Indicator::totalIgnoreMaster(Indicator::HeartDesireCalc($customer)) - Indicator::totalIgnoreMaster(Indicator::PersonalityCalc($customer)))
        ]);
        array_push($map, [
            'indicator' => 'balance',
            'number' => Indicator::BalanceCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'birthday',
            'number' => Indicator::BirthdayCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'maturity',
            'number' => Indicator::total(Indicator::LifePathCalc($customer) + Indicator::ExpressionCalc($customer))
        ]);
        array_push($map, [
            'indicator' => 'karmic_lessons',
            'number' => Indicator::KarmicLessonsCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'rational_thought',
            'number' => Indicator::RationalThoughtCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'subconscious_confidence',
            'number' => 9 - sizeof(Indicator::KarmicLessonsCalc($customer))
        ]);
        array_push($map, [
            'indicator' => 'hidden_passion',
            'number' => Indicator::HiddenPassionCalc($customer)
        ]);
        array_push($map, [
            'indicator' => 'challennge',
            'number' => Indicator::ChallengeAndPinnacleCalc($customer)['challenge']
        ]);
        array_push($map, [
            'indicator' => 'pinnacle',
            'number' => Indicator::ChallengeAndPinnacleCalc($customer)['pinnacle']
        ]);
        array_push($map, [
            'indicator' => 'age',
            'number' => Indicator::ChallengeAndPinnacleCalc($customer)['age']
        ]);
        array_push($map, [
            'indicator' => 'root',
            'number' => Indicator::ChallengeAndPinnacleCalc($customer)['root']
        ]);
        array_push($map, [
            'indicator' => 'year',
            'number' => Indicator::YearAndMonthCalc($customer),
        ]);
        return $map;
    }

    public function getDobAttribute($value)
    {
        return \Carbon\Carbon::parse($value)->format('d/m/Y');
    }

    public function setDobAttribute($value)
    {
        $this->attributes['dob'] = \Carbon\Carbon::createFromFormat('d/m/Y', $value)->format('Y-m-d');
    }
}
