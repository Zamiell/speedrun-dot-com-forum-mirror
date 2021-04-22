package main

/*

This is an example of the HTML that we are scaping & parsing:

<div class="panel">
	<table class="reverse-padding">
		<tr class="cell2 hidden-xs">
			<th>&nbsp;</th>
			<th>Thread</th>
			<th>User</th>
			<th>Replies</th>
			<th class='hidden-sm'>Views</th>
			<th>Last reply</th>
		</tr>
				<tr class="itemrow0 border-top linked cell0" data-target="/afterbirthplus/thread/pffgt">
			<td class='center forum-cell-new'>&nbsp;</td>
			<td>Sticky: <a href="/afterbirthplus/thread/pffgt">Discord Server for Isaac Racing &amp; Speedrunning</a><small class='hidden-sm-up ml-2'>by <a class='link-username nobr nounderline' href='/user/Zamiel'><span class='username' ><span class="username-light" style="color: #C75C9F">Zamiel</span><span class="username-dark" style="color: #F772C5">Zamiel</span></span></a></small></td>
			<td class='center forum-cell-user hidden-xs'><a class='link-username nobr nounderline' href='/user/Zamiel'><span class='username' ><span class="username-light" style="color: #C75C9F">Zamiel</span><span class="username-dark" style="color: #F772C5">Zamiel</span></span></a></td>
			<td class='center forum-cell-posts hidden-xs'>0</td>
			<td class='center forum-cell-views hidden-xs hidden-sm'>3,449</td>
			<td class='center forum-cell-lastpost hidden-xs'><a href="/post/151f5"><time class="short" datetime="2017-01-08T05:19:59Z">8 Jan 2017</time></a><br><small class="nobr">by <a class='link-username nobr nounderline' href='/user/Zamiel'><span class='username' ><span class="username-light" style="color: #C75C9F">Zamiel</span><span class="username-dark" style="color: #F772C5">Zamiel</span></span></a></small></td>
		</tr>
				<tr class="itemrow1 border-top linked" data-target="/afterbirthplus/thread/piwb7">
			<td class='center forum-cell-new'>&nbsp;</td>
			<td><a href="/afterbirthplus/thread/piwb7">Move 1 Chararacter Rules to Game Rules</a><small class='hidden-sm-up ml-2'>by <a class='link-username nobr nounderline' href='/user/thisguyisbarry'><span class='username' ><span class="username-light" style="color: #A010A0">thisguyisbarry</span><span class="username-dark" style="color: #A010A0">thisguyisbarry</span></span></a></small></td>
			<td class='center forum-cell-user hidden-xs'><a class='link-username nobr nounderline' href='/user/thisguyisbarry'><span class='username' ><span class="username-light" style="color: #A010A0">thisguyisbarry</span><span class="username-dark" style="color: #A010A0">thisguyisbarry</span></span></a></td>
			<td class='center forum-cell-posts hidden-xs'>1</td>
			<td class='center forum-cell-views hidden-xs hidden-sm'>83</td>
			<td class='center forum-cell-lastpost hidden-xs'><a href="/post/fngzd"><time class="short" datetime="2021-02-15T20:08:02Z">15 Feb 2021</time></a><br><small class="nobr">by <a class='link-username nobr nounderline' href='/user/Gamonymous'><img class='usericon' src='/images/icons/mod.png' title='' alt='' data-toggle='tooltip' data-placement='top' data-original-title='Mod'><span class='username' ><span class="username-light" style="color: #E44141">Gamonymous</span><span class="username-dark" style="color: #EE4444">Gamonymous</span></span></a></small></td>
		</tr>
*/
