<#import "template.ftl" as layout>

<@layout.registrationLayout
  displayMessage=!messagesPerField.existsError('username','password')
  displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??;
  section
>
  <#if section = "form">
    <h2 style="color: crimson; text-align: center;">🚀 これはカスタムログイン画面です</h2>

    <form id="kc-form-login" action="${url.loginAction}" method="post" class="space-y-4" style="margin-top: 2rem;">

      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">
          🎯 カスタムユーザー名
        </label>
        <input
          id="username"
          name="username"
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value="${(login.username!'')}"
          autofocus
        />
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">
          🔒 カスタムパスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
          style="background-color: darkgreen;"
        >
          🚀 ログインする！
        </button>
      </div>

    </form>
  </#if>
</@layout.registrationLayout>
