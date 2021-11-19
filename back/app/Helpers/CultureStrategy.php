<?php
namespace App\Helpers;

use Exception;

class CultureStrategy
{
    public function __construct(
        public int $current_culture_id,
        public int $suggested_culture_id,
    )
    {}

    public function check(): bool
    {
        $current = $this->current_culture_id % 11;
        $suggested = $this->suggested_culture_id % 11;

        switch($current) {
            case 0;
                return true;
            break;
            case 1:
                return $this->x1($suggested);
            break;
            case 2:
                return $this->x2($suggested);
            break;
            case 3:
                return $this->x3($suggested);
            break;
            case 4:
                return $this->x4($suggested);
            break;
            case 5:
                return $this->x5($suggested);
            break;
            case 6:
                return $this->x6($suggested);
            break;
            case 7:
                return $this->x7($suggested);
            break;
            case 8:
                return $this->x8($suggested);
            break;
            case 9:
                return $this->x9($suggested);
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');

        }
    }

    protected function x1(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return false;
            break;
            case 2:
                return true;
            break;
            case 3:
                return true;
            break;
            case 4:
                return true;
            break;
            case 5:
                return true;
            break;
            case 6:
                return true;
            break;
            case 7:
                return true;
            break;
            case 8:
                return true;
            break;
            case 9:
                return true;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x2(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return false;
            break;
            case 3:
                return true;
            break;
            case 4:
                return true;
            break;
            case 5:
                return true;
            break;
            case 6:
                return false;
            break;
            case 7:
                return true;
            break;
            case 8:
                return true;
            break;
            case 9:
                return true;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x3(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return true;
            break;
            case 3:
                return false;
            break;
            case 4:
                return true;
            break;
            case 5:
                return false;
            break;
            case 6:
                return false;
            break;
            case 7:
                return false;
            break;
            case 8:
                return false;
            break;
            case 9:
                return false;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x4(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return true;
            break;
            case 3:
                return false;
            break;
            case 4:
                return false;
            break;
            case 5:
                return true;
            break;
            case 6:
                return true;
            break;
            case 7:
                return true;
            break;
            case 8:
                return false;
            break;
            case 9:
                return true;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x5(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return false;
            break;
            case 3:
                return true;
            break;
            case 4:
                return true;
            break;
            case 5:
                return false;
            break;
            case 6:
                return true;
            break;
            case 7:
                return true;
            break;
            case 8:
                return false;
            break;
            case 9:
                return true;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x6(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return true;
            break;
            case 3:
                return false;
            break;
            case 4:
                return false;
            break;
            case 5:
                return false;
            break;
            case 6:
                return false;
            break;
            case 7:
                return false;
            break;
            case 8:
                return false;
            break;
            case 9:
                return false;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x7(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return false;
            break;
            case 3:
                return false;
            break;
            case 4:
                return false;
            break;
            case 5:
                return false;
            break;
            case 6:
                return true;
            break;
            case 7:
                return false;
            break;
            case 8:
                return false;
            break;
            case 9:
                return false;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x8(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return false;
            break;
            case 3:
                return false;
            break;
            case 4:
                return false;
            break;
            case 5:
                return false;
            break;
            case 6:
                return true;
            break;
            case 7:
                return false;
            break;
            case 8:
                return false;
            break;
            case 9:
                return false;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }

    protected function x9(int $suggested_id): bool
    {
        switch($suggested_id) {
            case 1:
                return true;
            break;
            case 2:
                return false;
            break;
            case 3:
                return false;
            break;
            case 4:
                return false;
            break;
            case 5:
                return true;
            break;
            case 6:
                return false;
            break;
            case 7:
                return true;
            break;
            case 8:
                return false;
            break;
            case 9:
                return false;
            break;
            case 10:
                return false;
            break;
            default:
                throw new Exception('not implemented');
        }
    }
}