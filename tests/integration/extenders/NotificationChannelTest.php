<?php

/*
 * This file is part of Flarum.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace Flarum\Tests\integration\extenders;

use Flarum\Extend\Notification;
use Flarum\Tests\integration\RetrievesAuthorizedUsers;
use Flarum\Tests\integration\TestCase;
use Flarum\User\NotificationPreference;
use Flarum\User\User;

class NotificationChannelTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp()
    {
        parent::setUp();

        $this->prepareDatabase([
            'users' => [
                $this->normalUser()
            ]
        ]);
    }

    private function add_channel()
    {
        $this->extend((new Notification)->addChannel('test'));
    }

    /**
     * @test
     */
    public function can_enable_notification_channel()
    {
        $this->add_channel();

        /** @var User $user */
        $user = User::find(2);

        NotificationPreference::setNotificationPreference($user, 'test', 'newPost');

        $this->assertTrue(
            $user->notificationPreferences()
                ->where('channel', 'test')
                ->where('type', 'newPost')
                ->get('enabled')
        );
    }
}